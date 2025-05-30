"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
}

function getLastFourNews(news: NewsItem[]): NewsItem[] {
  return news
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0);
}

export default function Newspage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();
        setNews(getLastFourNews(data.data));
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
    <Header/>
      {loading ? (
        <div className="px-4 sm:px-10 md:px-[100px] py-8 text-lg sm:text-xl text-blue-800 font-medium">
          Loading...
        </div>
      ) : news.length === 0 ? (
        <div className="px-4 sm:px-10 md:px-[100px] py-8 text-lg sm:text-xl text-red-500">
          No news found.
        </div>
      ) : (
        <section className="px-4 lg:px-[150px] sm:px-10 md:px-[100px] py-10 font-sans animate-fade-in">
          {/* Featured News */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[460px] rounded-2xl overflow-hidden shadow-lg group transition-transform duration-500 hover:scale-[1.01]">
            <Image
              src={news[0]?.image || "/placeholder.jpg"}
              alt={news[0]?.title || "News Image"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 text-white max-w-[90%] sm:max-w-xl">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold drop-shadow-lg">
                {news[0]?.title}
              </h3>
              <p className="text-xs sm:text-sm mt-2 text-gray-200 drop-shadow-sm">
                {news[0]?.date}
              </p>
            </div>
          </div>

          {/* Other News */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-12">
            {news.map((item) => (
              <Link href={`/news/${item.id}`} key={item.id}>
                <div
                  className="cursor-pointer bg-gray-503 rounded-xl overflow-hidden shadow-md hover:shadow-xl 
                   transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative w-full h-52">
                    <Image
                      src={item?.image || "/placeholder.jpg"}
                      alt={item?.title || "News Image"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col flex-grow">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-700 line-clamp-2">
                      {item?.title || "none"}
                    </h4>
                    <p className="text-gray-700 hover:font-bold text-sm mt-2 line-clamp-3">
                      {item?.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-auto pt-3">{item?.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      {/* <Footer /> */}
    </>
  );
}
