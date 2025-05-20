"use client";

import { useEffect, useState } from "react";

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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <section className="bg-white px-6 md:px-20 py-16 ">
      <h2 className="text-4xl text-blue-900 font-extrabold text-center mb-16">
        🛤️ Our History
      </h2>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="relative flex justify-center">
          <div className="pl-6 w-full md:w-[70%]">
            {items.map((item) => (
              <div key={item.id} className="mb-16 relative group">
                {/* Year circle */}
                <div className="absolute -left-[33px] top-0 bg-blue-900 text-white w-[66px] h-[66px] rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10 border-4 border-white ">
                  {item.year}
                </div>

                {/* Timeline line extension */}
                <div className="absolute -left-1 top-[66px] h-[calc(100%-66px)] w-2 bg-blue-200"></div>

                {/* Content block */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-lg md:flex md:items-center gap-6 transition-transform duration-300 group-hover:scale-[1.02]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full md:w-[240px] h-[160px] object-cover rounded-xl shadow-md"
                  />

                  <div className="mt-4 md:mt-0">
                    <h3 className="text-2xl font-bold text-blue-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-[15px] tracking-wide">
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
