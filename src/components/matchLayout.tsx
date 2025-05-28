"use client";

import { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";
import { match } from "assert";

interface Team {
  name: string;
  image: string | null;
}

interface Match {
  id: string;
  match_date: string;
  match_time: string;
  teamA_score:number | null;
  teamB_score:number | null;
  location: string;
  status:string
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
  status,
  teamA_score,
  teamB_score
  
}: {
  teamA: Team;
  teamB: Team;
  sport: string;
  date: string;
  time: string;
  location: string;
  status:string;
  teamA_score:number;
  teamB_score:number
}) {
  const defaultImage = "https://via.placeholder.com/80x80?text=Team";

  return (
    <div className="rounded-xl overflow-hidden shadow-md transition-transform hover:scale-[1.02] hover:shadow-pink-300 duration-300 border border-pink-600 bg-white/90">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-700 text-white p-4 sm:p-5 flex justify-between items-center">
        <div className="text-center space-y-1 sm:space-y-2 w-1/3">
          <Image
            src={teamA.image || defaultImage}
            alt={teamA.name}
            width={64}
            height={64}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto object-cover border border-white"
          />
          <p className="text-xs sm:text-sm font-medium truncate">
            {teamA.name}
          </p>
          <p className="text-xs sm:text-sm font-medium truncate">
            {teamA_score}
          </p>
          
        </div>

        <div className="text-base sm:text-xl font-bold">VS</div>

        <div className="text-center space-y-1 sm:space-y-2 w-1/3">
          <Image
            src={teamB.image || defaultImage}
            alt={teamB.name}
            width={64}
            height={64}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto object-cover border border-white"
          />
          <p className="text-xs sm:text-sm font-medium truncate">
            {teamB.name}
          </p>
          <p className="text-xs sm:text-sm font-medium truncate">
            {teamB_score}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white p-3 sm:p-4 space-y-2 text-center rounded-b-xl">
        <p className="text-sm sm:text-base font-semibold text-purple-700">
          {sport}
        </p>

        <div className="flex justify-center items-center gap-2 text-xs sm:text-sm text-gray-600">
          <FaClock className="text-pink-600" />
          <span>
            {date} • {time}
          </span>
        </div>

        <div className="flex justify-center items-center gap-2 text-xs sm:text-sm text-gray-600">
          <FaMapMarkerAlt className="text-pink-600" />
          <span className="truncate">{location}</span>
        </div>

        <div className="flex justify-center items-center gap-2 text-lg sm:text-sm text-gray-600">
          <span className="truncate text-sm font-bold">{status}</span>
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
        const res = await fetch("/api/match_friendly");
        if (!res.ok) throw new Error("Failed to fetch matches");
        const data = await res.json();
        setMatches(data || []);
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
    <div className="px-4 sm:px-8 md:px-16 py-10 text-white">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-pink-500 to-purple-700 text-transparent bg-clip-text">
        Upcoming Friendly Matches
      </h2>

      {loading && (
        <p className="text-center text-pink-300">Loading matches...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !matches.length && (
        <p className="text-center text-pink-100 text-lg">
          No matches available
        </p>
      )}

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              teamA={match.teamA}
              teamB={match.teamB}
              sport={match.sportType.name}
              date={new Date(match.match_date).toLocaleDateString("en-GB")}
              time={match.match_time.slice(0, 5)}
              location={match.location}
              status={match.status}
              teamA_score={match.teamA_score ?? 0}
              teamB_score={match.teamB_score ?? 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
