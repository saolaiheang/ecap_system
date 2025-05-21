"use client";

import { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

interface Team {
  name: string;
  image: string | null;
}

interface Match {
  id: string;
  match_date: string;
  match_time: string;
  location: string;
  teamA: Team;
  teamB: Team;
  sportType: {
    name: string;
  };
}

function MatchCard({
  teamA,
  teamB,
  sport,
  date,
  time,
  location,
}: {
  teamA: Team;
  teamB: Team;
  sport: string;
  date: string;
  time: string;
  location: string;
}) {
  const defaultImage = "https://via.placeholder.com/80x80?text=Team";

  return (
    <div className="max-w-xs rounded-xl overflow-hidden shadow-lg bg-white">
      <div className="bg-[#2C357C] text-white p-4 flex justify-between items-center rounded-t-xl">
        <div className="text-center">
          <img
            src={teamA.image || defaultImage}
            alt={teamA.name}
            className="w-12 h-12 rounded-full mx-auto"
          />
          <p className="text-sm mt-2">{teamA.name}</p>
        </div>

        <p className="text-xl font-semibold">VS</p>

        <div className="text-center">
          <img
            src={teamB.image || defaultImage}
            alt={teamB.name}
            className="w-12 h-12 rounded-full mx-auto"
          />
          <p className="text-sm mt-2">{teamB.name}</p>
        </div>
      </div>

      <div className="bg-gray-300 p-4 space-y-2 rounded-b-xl">
        <p className="text-center text-lg font-medium">{sport}</p>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
          <FaClock />
          <span>
            {date} - {time}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
          <FaMapMarkerAlt />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}

export default function MatchLayout() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/matches");
        if (!res.ok) throw new Error("Failed to fetch matches");
        const data = await res.json();
        setMatches(data.data || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <p className="px-8 py-6 text-blue-600">Loading matches...</p>;
  if (error) return <p className="px-8 py-6 text-red-500">{error}</p>;

  return (
    <div className="p-8 px-[200px] bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Upcoming Matches</h2>

      {!matches.length && (
        <p className="text-center text-gray-600 text-lg">No matches available</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            teamA={match.teamA}
            teamB={match.teamB}
            sport={match.sportType.name}
            date={new Date(match.match_date).toLocaleDateString("en-GB")}
            time={match.match_time.slice(0, 5)} // or format time if needed
            location={match.location}
          />
        ))}
      </div>
    </div>
  );
}
