"use client";

import Header from "@/components/header";
import { useEffect, useState } from "react";

interface CoachInput {
  id: string;
  name: string;
  contact_info: string;
  image: string;
}

export default function Coachpage() {
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
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  if (loading) return <p className="px-8 py-6 text-lg text-blue-600">Loading coaches...</p>;
  if (error) return <p className="px-8 py-6 text-red-500">{error}</p>;

  return (
    <>
      <Header />
      <section className="px-6 md:px-12 lg:px-20 py-10 bg-gradient-to-br from-blue-50 to-white min-h-screen justify-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-10">
          💼 Meet Our Coaches
        </h2>

        {!coaches.length && (
          <div className="text-center text-red-500 text-lg font-medium mb-4">
            No coaches to display
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-white group hover:shadow-blue-400 transition duration-300"
            >
              <div className="h-[260px] overflow-hidden relative">
                <img
                  src={coach.image || "https://via.placeholder.com/300x300"}
                  alt={coach.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-4 space-y-1 text-center">
                <p className="text-lg font-semibold text-blue-900">{coach.name}</p>
                <p className="text-sm text-gray-600">📞 {coach.contact_info}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
