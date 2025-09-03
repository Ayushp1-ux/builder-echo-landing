import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CourtNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function fetchNews() {
      const { data, error } = await supabase
        .from("court_news")
        .select("*")
        .order("news_date", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching news:", error);
      } else {
        setNews(data);
      }
    }
    fetchNews();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Latest Court News</h2>
      <ul>
        {news.map((item) => (
          <li key={item.id} className="mb-6">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">{new Date(item.news_date).toLocaleDateString()}</p>
            <p>{item.content}</p>
            {item.link && (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Read more
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
