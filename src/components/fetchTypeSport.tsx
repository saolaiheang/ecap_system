"use client";

import { useEffect, useState } from "react";

interface Sport {
  id: string;
  name: string;
  description?: string;
}

export default function AdminPage() {
  const [sports, setSports] = useState<Sport[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch("/api/typeofsport");
        const data = await response.json();
        console.log("Fetched data:", data);
        const typeOfSport = data?.typeOfSport;
        setSports(Array.isArray(typeOfSport) ? typeOfSport : []);
      } catch (error) {
        console.error("Failed to fetch sports:", error);
        setSports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Types of Sport</h1>
      {loading ? (
        <p>Loading...</p>
      ) : Array.isArray(sports) && sports.length > 0 ? (
        <ul className="list-disc ml-5">
          {sports.map((sport) => (
            <li key={sport.id}>
              {sport.name} {sport.description && `– ${sport.description}`}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-red-500">No sports data found</p>
      )}
    </div>
  );
}
