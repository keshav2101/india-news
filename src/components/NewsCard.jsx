import { format } from 'date-fns';

function NewsCard({ article }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={article.image} 
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="text-sm text-blue-600 mb-2">{article.category}</div>
        <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{article.summary}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{article.author}</span>
          <span>{format(new Date(article.date), 'MMM d, yyyy')}</span>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;