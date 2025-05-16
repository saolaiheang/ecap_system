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

  if (loading) return <p className="px-8 py-6">Loading coaches...</p>;
  if (error) return <p className="px-8 py-6 text-red-500">{error}</p>;

  return (
    <>
    <Header/>
    <section className="px-8 py-6">
      <h2 className="text-4xl font-bold text-blue-600 mb-8 ">Coach List</h2>
      {!coaches.length && (
        <div className="text-center text-red-500 mb-4">No coaches to display</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="bg-white rounded-2xl shadow-md border border-blue-100 hover:shadow-blue-400 transition duration-300"
          >
            <div className="h-[300px] w-full overflow-hidden">
              <img
                src={coach.image || "https://via.placeholder.com/300x300"}
                alt={coach.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 text-left space-y-2">
              <p className="text-lg font-semibold text-blue-700">Name: {coach.name}</p>
              <p className="text-md text-blue-600">Contact: {coach.contact_info}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}
