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
    <section className=" px-6 md:px-20 py-16 lg:px-[5px]">
      <h2
        className="text-4xl font-extrabold text-center mb-16 
                 bg-gradient-to-r from-pink-500  to-purple-700 bg-clip-text text-transparent drop-shadow-lg"
      >
        🛤️ Our History
      </h2>

      {loading && <p className="text-center text-gray-400">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="relative flex justify-center">
          <div className="pl-6 w-full md:w-[70%]">
            {items.map((item) => (
              <div key={item.id} className="mb-16 relative group">
                {/* Year circle */}
                <div
                  className="absolute -left-[33px] top-0 bg-gradient-to-r from-pink-500  to-purple-700 text-white 
                            w-[66px] h-[66px] rounded-full flex items-center justify-center 
                            font-bold text-lg shadow-xl z-10 border-4 border-pink-500"
                >
                  {item.year}
                </div>

                {/* Timeline line extension */}
                <div className="absolute -left-1 top-[66px] h-[calc(100%-66px)] w-1 bg-pink-500"></div>

                {/* Content block */}
                <div
                  className="bg-gray-200 p-6 rounded-xl shadow-xl md:flex md:items-center gap-6 
                            transition-transform duration-300 group-hover:scale-[1.02]"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={150}
                    height={100}
                    className="w-full md:w-[240px] h-[160px] object-cover rounded-xl shadow-md border border-white/10"
                  />

                  <div className="mt-4 md:mt-0 text-white">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500  to-purple-700 bg-clip-text text-transparent drop-shadow-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 hover:font-bold leading-relaxed text-[15px] tracking-wide">
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
