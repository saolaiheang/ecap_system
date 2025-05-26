"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface SportType {
  id: string;
  name: string;
  image: string | null;
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

interface Stage {
  id: string;
  name: string;
  type: string;
  competition_id: string;
}

export default function LayoutCompetition() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [stages, setStages] = useState<Record<string, Stage[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch("/api/competitions");
        const result = await response.json();
        setCompetitions(result.data);

        // Fetch stages for each competition
        const stagesData: Record<string, Stage[]> = {};
        await Promise.all(
          result.data.map(async (comp: Competition) => {
            const res = await fetch(`/api/competitions/${comp.id}/stages`);
            const data = await res.json();
            stagesData[comp.id] = data.data;
          })
        );

        setStages(stagesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Competitions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {competitions.map((comp) => (
            <div
              key={comp.id}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              {comp.image ? (
                <Image
                  src={comp.image}
                  alt={comp.name}
                  width={400}
                  height={200}
                  className="rounded-md object-cover"
                />
              ) : (
                <div className="bg-gray-200 w-full h-[200px] rounded-md flex items-center justify-center">
                  No Image
                </div>
              )}
              <h2 className="text-xl font-semibold mt-3">{comp.name}</h2>
              <p className="text-gray-600">{comp.location}</p>
              <p className="text-sm text-gray-500">Date: {comp.start_date}</p>
              <div className="mt-2">
                <p className="font-medium">Sport Type: {comp.sportType.name}</p>
                <p className="text-sm text-gray-500">
                  {comp.sportType.description.length > 100
                    ? comp.sportType.description.slice(0, 100) + "..."
                    : comp.sportType.description}
                </p>
              </div>

              {/* Stages */}
              <div className="mt-4">
                <p className="font-semibold">Stages:</p>
                {stages[comp.id] && stages[comp.id].length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {stages[comp.id].map((stage) => (
                      <li key={stage.id}>
                        {stage.name}{" "}
                        <span className="text-gray-500">({stage.type})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">No stages found</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
