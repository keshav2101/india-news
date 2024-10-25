import { Link } from 'react-router-dom';

function Navbar() {
  const categories = [
    'National', 'Politics', 'Business', 'Technology', 
    'Entertainment', 'Sports', 'Health'
  ];

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">India News Today</Link>
          <div className="hidden md:flex space-x-4">
            {categories.map(category => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase()}`}
                className="hover:text-blue-200 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;