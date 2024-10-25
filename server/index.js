import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Database setup
const db = new Database('news.db');
db.pragma('journal_mode = WAL');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    summary TEXT,
    content TEXT,
    category TEXT,
    author TEXT,
    image TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key');
  res.json({ token });
});

// Article routes
app.get('/api/articles', (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM articles';
  const params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  if (search) {
    query += category ? ' AND' : ' WHERE';
    query += ' (title LIKE ? OR content LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY date DESC';
  const articles = db.prepare(query).all(...params);
  res.json(articles);
});

app.post('/api/articles', authenticateToken, upload.single('image'), (req, res) => {
  const { title, summary, content, category, author } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const result = db.prepare(`
    INSERT INTO articles (title, summary, content, category, author, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, summary, content, category, author, image);

  res.status(201).json({ id: result.lastInsertRowid });
});

app.put('/api/articles/:id', authenticateToken, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, summary, content, category, author } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  let query = 'UPDATE articles SET title = ?, summary = ?, content = ?, category = ?, author = ?';
  const params = [title, summary, content, category, author];

  if (image) {
    query += ', image = ?';
    params.push(image);
  }

  query += ' WHERE id = ?';
  params.push(id);

  db.prepare(query).run(...params);
  res.json({ message: 'Article updated successfully' });
});

app.delete('/api/articles/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM articles WHERE id = ?').run(id);
  res.json({ message: 'Article deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});