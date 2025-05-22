"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import TypesOfSport from "./typeSport";
import { useSearchParams } from "react-router-dom";

interface Competition {
  id: string;
  match_date: string;
  match_time: string;
  location: string;
  teamA: { name: string };
  teamB: { name: string };
  sportType: { name: string };
}
interface SportType {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

export default function FetchMatch() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeofsport, setSportTypes] = useState<SportType[]>([]);

  const [form, setForm] = useState({
    match_date: "",
    match_time: "",
    location: "",
    sport_type_id: "",
    teamA_id: "",
    teamB_id: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/match_friendly/b");
      if (!res.ok) throw new Error("Failed to fetch matches.");
      const data = await res.json();
      setCompetitions(data.data || []);
    } catch (err) {
      setError("Failed to load matches.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSportTypes = async () => {
    try {
      const res = await fetch("/api/typeofsport");
      const data = await res.json();
      setSportTypes(data.typeOfSport || []);
    } catch {
      console.error("Failed to fetch sport types.");
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/team");
      if (!res.ok) throw new Error("Failed to fetch teams.");
      const data = await res.json();
      setTeams(data.data || []);
    } catch (err) {
      console.error("Error loading teams:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this match?")) return;
    try {
      const res = await fetch(`/api/matches/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete match");
      setCompetitions((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Error deleting match.");
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add match");
      await fetchCompetitions();
      setForm({
        match_date: "",
        match_time: "",
        location: "",
        sport_type_id: "",
        teamA_id: "",
        teamB_id: "",
      });
    } catch (err) {
      alert("Error adding match.");
    }
  };

  useEffect(() => {
    fetchCompetitions();
    fetchTeams();
    fetchSportTypes();
  }, []);

  if (loading) return <p className="px-8 py-6">Loading competitions...</p>;
  if (error) return <p className="px-8 py-6 text-red-500">{error}</p>;

  return (
    <section className="px-8 py-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">Match Dashboard</h2>

      {/* Match Form */}
      <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Add New Match</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="match_date"
            value={form.match_date}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Match Date"
          />
          <input
            type="time"
            name="match_time"
            value={form.match_time}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Match Time"
          />
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Location"
          />

<select
  name="sport_type_id"
  value={form.sport_type_id}
  onChange={handleInputChange}
  className="border p-2 rounded"
>
  <option value="">Select Sport Type</option>
  {typeofsport.map((sport) => (
    <option key={sport.id} value={sport.id}>
      {sport.name}
    </option>
  ))}
</select>


          {/* Team A Dropdown */}
          <select
            name="teamA_id"
            value={form.teamA_id}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="">Select Team A</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          {/* Team B Dropdown */}
          <select
            name="teamB_id"
            value={form.teamB_id}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="">Select Team B</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

        </div>
        <div className="mt-4">
          <Button
            onClick={handleAdd}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Submit Match
          </Button>
        </div>
      </div>

      {/* Match Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm bg-white border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border-b">Team A</th>
              <th className="px-4 py-2 border-b">Team B</th>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Time</th>
              <th className="px-4 py-2 border-b">Location</th>
              <th className="px-4 py-2 border-b">Sport</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {competitions.map((comp) => (
              <tr key={comp.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{comp.teamA?.name}</td>
                <td className="px-4 py-2 border-b">{comp.teamB?.name}</td>
                <td className="px-4 py-2 border-b">{comp.match_date}</td>
                <td className="px-4 py-2 border-b">{comp.match_time}</td>
                <td className="px-4 py-2 border-b">{comp.location}</td>
                <td className="px-4 py-2 border-b">{comp.sportType?.name}</td>
                <td className="px-4 py-2 border-b">
                  <Button className="bg-yellow-500 text-xs text-white mr-2 hover:bg-yellow-600">
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(comp.id)}
                    className="bg-red-500 text-xs text-white hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
