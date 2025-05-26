"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type HistoryItem = {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl: string;
};

export default function HistorySection() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/histories");
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setItems(data.data);
      } catch (error) {
        console.error("Failed to fetch history", error);
        setError("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <section className="px-4 sm:px-10 md:px-20 py-16 bg-gradient-to-b from-white via-purple-50 to-white">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-16 bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent drop-shadow-xl">
        🛤️ Our History
      </h2>

      {loading && <p className="text-center text-gray-400">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="relative flex justify-center">
          <div className="pl-6 w-full md:w-[80%]">
            {items.map((item) => (
              <div key={item.id} className="mb-20 relative group">
                {/* Year badge */}
                <div className="absolute -left-[33px] top-0 bg-gradient-to-tr from-purple-600 to-pink-500 text-white w-[66px] h-[66px] rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white z-10">
                  {item.year}
                </div>

                {/* Timeline line */}
                <div className="absolute -left-1 top-[66px] h-[calc(100%-66px)] w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-pink-500 shadow-inner"></div>

                {/* History card */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md md:flex md:items-center gap-6 border border-gray-200 hover:shadow-xl transition-transform duration-300 group-hover:scale-[1.02]">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={240}
                    height={160}
                    className="w-full sm:w-[240px] h-[160px] object-cover rounded-xl shadow-md border border-gray-200"
                  />
                  <div className="mt-4 md:mt-0 text-gray-800">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
                      {item.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed tracking-wide text-gray-600 group-hover:text-gray-800 transition duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
