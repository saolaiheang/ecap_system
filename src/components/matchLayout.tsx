"use client";

import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

interface MatchCardProps {
  teamA: {
    name: string;
    image: string;
  };
  teamB: {
    name: string;
    image: string;
  };
  sport: string;
  date: string;
  time: string;
  location: string;
}

function MatchCard({
  teamA,
  teamB,
  sport,
  date,
  time,
  location,
}: MatchCardProps) {
  return (
    <div className="max-w-xs rounded-xl overflow-hidden shadow-lg bg-white">
      <div className="bg-[#2C357C] text-white p-4 flex justify-between items-center rounded-t-xl">
        <div className="text-center">
          <img
            src={teamA.image}
            alt={teamA.name}
            className="w-12 h-12 rounded-full mx-auto"
          />
          <p className="text-sm mt-2">{teamA.name}</p>
        </div>

        <p className="text-xl font-semibold">VS</p>

        <div className="text-center">
          <img
            src={teamB.image}
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
  return (
    <div className="p-6">
      <MatchCard
        teamA={{ name: "PSE", image: "/monika.jpg" }}
        teamB={{ name: "PSE", image: "/monika.jpg" }}
        sport="Football"
        date="02 / 04 / 2026"
        time="3:30 PM"
        location="Location"
      />
    </div>
  );
}
