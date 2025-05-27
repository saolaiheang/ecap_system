"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";

interface SportType {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface Competition {
  id: string;
  name: string;
  sport_type_id: string;
  start_date: string;
  location: string;
  image: string | null;
  sportType: SportType;
}

export default function FetchCompetitionLayout() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const res = await fetch("/api/competitions", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch competitions");
        const json = await res.json();
        setCompetitions(json.data);
      } catch (error) {
        console.error("Error fetching competitions:", error);
      }
    }

    fetchCompetitions();
  }, []);

  return (
    <div className="px-[150px]">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Competitions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((competition) => (
          <div
            key={competition.id}
            className="rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="p-4">
              <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src={competition.image || competition.sportType.image}
                  alt={competition.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {competition.name}
              </h2>
              <p className="text-sm text-gray-500">
                🏟️ {competition.location}
              </p>
              <p className="text-sm text-gray-500">
                🗓️ {competition.start_date}
              </p>
              <p className="text-sm mt-2 text-purple-600">
                Sport: {competition.sportType.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
