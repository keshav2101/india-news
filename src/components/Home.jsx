import { useState } from 'react';
import NewsCard from './NewsCard';
import { sampleNews } from '../data/sampleNews';

function Home() {
  const [news] = useState(sampleNews);

  return (
    <div className="space-y-8">
      <section className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Latest News Across India
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;