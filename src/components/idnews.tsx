"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNewsDetail() {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/news/${id}`);

        if (!res.ok) {
          if (res.status === 404) {
            setNews(null);
            setError("News not found.");
          } else {
            throw new Error("Failed to fetch news.");
          }
        } else {
          const data = await res.json();
          setNews(data.data);
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        setNews(null);
      } finally {
        setLoading(false);
      }
    }

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-pink-500 font-semibold">Loading news...</div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">{error}</div>
    );
  }

  if (!news) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">News not found.</div>
    );
  }

  return (
    <>
      <Header />
      <main className="px-6 sm:px-10 md:px-[100px] py-10 max-w-5xl mx-auto text-white font-sans">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-700">
          {news.title}
        </h1>
        <p className="text-sm text-gray-300 mb-6">{news.date}</p>

        <div className="relative w-full h-64 sm:h-96 mb-6 rounded-xl overflow-hidden">
          <Image
            src={news.image || "/placeholder.jpg"}
            alt={news.title}
            fill
            className="object-cover"
          />
        </div>

        <p className="text-base sm:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
          {news.description}
        </p>
      </main>
    </>
  );
}
