"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import Image from "next/image";
interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function Newspage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setNews(data.data);
        } else {
          console.error("API response is not an array:", data.data);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      <Header />

      {loading ? (
        <div className="px-4 py-6 text-lg sm:text-xl text-blue-700 font-medium">Loading...</div>
      ) : !news || news.length === 0 ? (
        <div className="px-4 py-6 text-lg sm:text-xl text-red-500">No news found.</div>
      ) : (
        <section className="px-4 sm:px-8 md:px-16 lg:px-[150px] py-10 font-sans animate-fade-in">
          {/* Featured news */}
          <div className="relative h-[280px] sm:h-[380px] md:h-[460px] rounded-2xl overflow-hidden shadow-lg mb-12">
            <Image
              src={news[0].image}
              alt={news[0].title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6 sm:p-10">
              <div className="text-white max-w-3xl">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-snug drop-shadow-md">
                  {news[0].title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 mt-2 drop-shadow-sm">
                  {news[0].date}
                </p>
              </div>
            </div>
          </div>

          {/* Other news */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.slice(1).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[180px] sm:h-[200px] object-cover"
                />
                <div className="p-5 flex flex-col h-full">
                  <h4 className="text-lg font-semibold text-blue-900 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-auto pt-4">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
