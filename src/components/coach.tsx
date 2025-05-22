"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
interface CoachInput {
  id: string;
  name: string;
  contact_info: string;
  image: string;
}

export default function Coach() {
  const [coaches, setCoaches] = useState<CoachInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch("/api/coaches");
        if (!res.ok) throw new Error("Failed to fetch coaches");

        const data = await res.json();
        console.log("API Response", data);

        let coachList: CoachInput[] = [];

        if (Array.isArray(data)) {
          coachList = data;
        } else if (Array.isArray(data?.data)) {
          coachList = data.data;
        } else if (
          typeof data === "object" &&
          data !== null &&
          Object.keys(data).length &&
          Array.isArray(Object.values(data)[0])
        ) {
          coachList = Object.values(data)[0] as CoachInput[];
        } else {
          console.warn("Unexpected API format:", data);
        }

        setCoaches(coachList);
      } catch (err) {
        console.error("Failed to fetch coach:", err);

        setError( "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  if (loading) return <p className="px-6 py-6 text-blue-600 text-lg font-medium">Loading coaches...</p>;
  if (error) return <p className="px-6 py-6 text-red-500">{error}</p>;

  return (
    <section className="px-6 sm:px-10 md:px-16 lg:px-[120px] py-12 font-sans">
      <h2 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-10 text-center">Meet Our Coaches</h2>

      {!coaches.length && (
        <p className="text-center text-red-500 text-lg font-medium">No coaches to display</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:px-[150px]">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-blue-300 transition-shadow duration-300 border border-gray-100 group"
          >
            <div className="h-[260px] overflow-hidden relative">
              <Image
                src={coach.image || "https://via.placeholder.com/300x300"}
                alt={coach.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="p-5">
              <p className="text-lg font-semibold text-black mb-1">{coach.name}</p>
              <p className="text-sm text-gray-600">📞 {coach.contact_info}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
