import { useParams } from 'react-router-dom';
import { useState } from 'react';
import NewsCard from './NewsCard';
import { sampleNews } from '../data/sampleNews';

function CategoryNews() {
  const { category } = useParams();
  const [news] = useState(
    sampleNews.filter(
      article => article.category.toLowerCase() === category.toLowerCase()
    )
  );

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800 capitalize mb-6">
        {category} News
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

export default CategoryNews;