"use client";

import { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";

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
    <div className="rounded-2xl overflow-hidden shadow-lg transition transform hover:scale-[1.02] hover:shadow-pink-300 duration-300 border border-pink-700 bg-white/90">
      <div className="bg-gradient-to-r from-pink-500 to-purple-700 text-white p-5 flex justify-between items-center">
        <div className="text-center space-y-2">
          <Image
            src={teamA.image || defaultImage}
            alt={teamA.name}
            width={100}
            height={100}
            className="w-16 h-16 rounded-full mx-auto object-cover border border-white"
          />
          <p className="text-sm font-medium">{teamA.name}</p>
        </div>

        <div className="text-xl font-bold">VS</div>

        <div className="text-center space-y-2">
          <Image
            src={teamB.image || defaultImage}
            alt={teamB.name}
            width={100}
            height={100}
            className="w-16 h-16 rounded-full mx-auto object-cover border border-white"
          />
          <p className="text-sm font-medium">{teamB.name}</p>
        </div>
      </div>

      <div className="bg-white p-4 space-y-2 text-center rounded-b-2xl">
        <p className="text-lg font-semibold text-purple-700">{sport}</p>

        <div className="flex justify-center items-center gap-2 text-sm text-gray-600">
          <FaClock className="text-pink-600" />
          <span>{date} • {time}</span>
        </div>

        <div className="flex justify-center items-center gap-2 text-sm text-gray-600">
          <FaMapMarkerAlt className="text-pink-600" />
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
      } catch (error) {
        console.error("Failed to fetch matches:", error);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="px-6 sm:px-12 md:px-24 py-10 lg:px-[150px] bg-black/90 min-h-screen text-white">
      <h2 className="text-3xl font-extrabold text-center mb-10 bg-gradient-to-r from-pink-500 to-purple-700 text-transparent bg-clip-text">
        Upcoming Matches
      </h2>

      {loading && <p className="text-center text-pink-300">Loading matches...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !matches.length && (
        <p className="text-center text-pink-100 text-lg">No matches available</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            teamA={match.teamA}
            teamB={match.teamB}
            sport={match.sportType.name}
            date={new Date(match.match_date).toLocaleDateString("en-GB")}
            time={match.match_time.slice(0, 5)}
            location={match.location}
          />
        ))}
      </div>
    </div>
  );
}
