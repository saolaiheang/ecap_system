"use client";

import { useEffect, useState, ChangeEvent } from "react";

interface Sport {
  id: string;
  name: string;
}

interface Match {
  id: string;
  team_a: string;
  team_b: string;
  date: string;
  location: string;
  sport_type?: {
    id: string;
    name: string;
  };
}

export default function FetchHisotry({ sport }: { sport: string }) {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [matchList, setMatchList] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    team_a: "",
    team_b: "",
    date: "",
    location: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMatch = async () => {
    if (!selectedSport) return alert("Please select a sport");

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sport_type_id: selectedSport,
        }),
      });

      const newMatch = await response.json();
      setMatchList((prev) => [...prev, newMatch]);
      alert("Match added successfully");

      setFormData({ team_a: "", team_b: "", date: "", location: "" });
    } catch (error) {
      console.error("Failed to add match:", error);
      alert("Failed to add match");
    }
  };

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await fetch("/api/typeofsport");
        const data = await res.json();
        setSports(data.typeOfSport);
      } catch (err) {
        console.error("Failed to fetch sports", err);
      }
    };

    fetchSports();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!selectedSport) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/history`);
        const data = await res.json();
        setMatchList(data.data);
      } catch (err) {
        console.error("Failed to fetch matches", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [selectedSport]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#1D276C] mb-4">History Management</h2>
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded w-1/3"
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
        >
          <option value="">Select a Sport</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          name="team_a"
          type="text"
          placeholder="Team A"
          value={formData.team_a}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="team_b"
          type="text"
          placeholder="Team B"
          value={formData.team_b}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="date"
          type="text"
          placeholder="Match Date"
          value={formData.date}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="location"
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAddMatch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition col-span-2"
        >
          Add Match
        </button>
      </div>

      {loading ? (
        <p>Loading matches...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Team A</th>
              <th className="border px-4 py-2">Team B</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Location</th>
              <th className="border px-4 py-2">Sport</th>
            </tr>
          </thead>
          <tbody>
            {matchList.length > 0 ? (
              matchList.map((match, index) => (
                <tr key={match.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{match.team_a}</td>
                  <td className="border px-4 py-2">{match.team_b}</td>
                  <td className="border px-4 py-2">{match.date}</td>
                  <td className="border px-4 py-2">{match.location}</td>
                  <td className="border px-4 py-2">{match.sport_type?.name || "Unknown"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No matches available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
