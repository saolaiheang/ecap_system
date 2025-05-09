"use client";

import { useState, ChangeEvent } from "react";

interface Match {
  id: number;
  teamA: string;
  teamB: string;
  day: string;
  time: string;
  location: string;
  sport: string;
  logoA: string; // image URL for team A
  logoB: string; // image URL for team B
}

export default function HockeyMatch() {
  const [matches, setMatches] = useState<Match[]>([]);

  const [formData, setFormData] = useState({
    teamA: "",
    teamB: "",
    day: "",
    time: "",
    location: "",
    sport: "",
    logoA: "",
    logoB: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMatch = () => {
    const { teamA, teamB, day, time, location, sport } = formData;
    if (!teamA || !teamB || !day || !time || !location || !sport) return;

    const newMatch: Match = {
      id: matches.length + 1,
      ...formData,
    };

    setMatches([...matches, newMatch]);
    setFormData({
      teamA: "",
      teamB: "",
      day: "",
      time: "",
      location: "",
      sport: "",
      logoA: "",
      logoB: "",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#1D276C]">Hockey Match</h2>

      {/* Add Match Form */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          name="teamA"
          placeholder="Team A"
          value={formData.teamA}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="teamB"
          placeholder="Team B"
          value={formData.teamB}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="day"
          placeholder="Day"
          value={formData.day}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="sport"
          placeholder="Sport Type"
          value={formData.sport}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="logoA"
          placeholder="Team A Logo URL"
          value={formData.logoA}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="logoB"
          placeholder="Team B Logo URL"
          value={formData.logoB}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <div className="col-span-4">
          <button
            onClick={handleAddMatch}
            className="bg-green-600 text-white rounded px-6 py-2 hover:bg-green-700"
          >
            Add Match
          </button>
        </div>
      </div>

      {/* Match Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Team A</th>
            <th className="border px-4 py-2">Team B</th>
            <th className="border px-4 py-2">Day</th>
            <th className="border px-4 py-2">Time</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Sport</th>
            <th className="border px-4 py-2">Logo A</th>
            <th className="border px-4 py-2">Logo B</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id}>
              <td className="border px-4 py-2">{match.id}</td>
              <td className="border px-4 py-2">{match.teamA}</td>
              <td className="border px-4 py-2">{match.teamB}</td>
              <td className="border px-4 py-2">{match.day}</td>
              <td className="border px-4 py-2">{match.time}</td>
              <td className="border px-4 py-2">{match.location}</td>
              <td className="border px-4 py-2">{match.sport}</td>
              <td className="border px-4 py-2">
                {match.logoA ? (
                  <img src={match.logoA} alt="Logo A" className="w-8 h-8 mx-auto" />
                ) : (
                  "-"
                )}
              </td>
              <td className="border px-4 py-2">
                {match.logoB ? (
                  <img src={match.logoB} alt="Logo B" className="w-8 h-8 mx-auto" />
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
