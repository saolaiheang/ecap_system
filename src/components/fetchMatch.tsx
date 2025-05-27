"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";

interface Match_friendly {
  id: string;
  match_date: string;
  match_time: string;
  location: string;
  teamA: { name: string };
  teamB: { name: string };
  sportType: { name: string };
  status: string;
  teamA_score: number;
  teamB_score: number;
}

interface Props {
  sport: string;
}

interface SportType {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

export default function FetchMatch({ sport }: Props) {
  const [competitions, setCompetitions] = useState<Match_friendly[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeofsport, setSportTypes] = useState<SportType[]>([]);
  const [editMatch, setEditMatch] = useState<Match_friendly | null>(null);

  const [form, setForm] = useState({
    match_date: "",
    match_time: "",
    location: "",
    sport_type_id: "",
    teamA_id: "",
    teamB_id: "",
    status: "scheduled",
  });

  const [editForm, setEditForm] = useState({
    status: "scheduled",
    teamA_score: null as number | null,
    teamB_score: null as number | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "teamA_score" || name === "teamB_score") {
      setForm({ ...form, [name]: value === "" ? null : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "teamA_score" || name === "teamB_score") {
      setEditForm({ ...editForm, [name]: value === "" ? null : Number(value) });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/match_friendly");
      if (!res.ok) throw new Error("Failed to fetch matches.");
      const data = await res.json();
      setCompetitions(data || []);
    } catch (err) {
      setError(
        `Failed to load matches. ${
          err instanceof Error ? err.message : String(err)
        }`
      );
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

  // const handleDelete = async (id: string) => {
  //   if (!confirm("Are you sure you want to delete this match?")) return;
  //   try {
  //     const res = await fetch(`/api/match_friendly/${id}`, {
  //       method: "DELETE",
  //     });
  //     if (res.ok) {
  //       alert("match deleted successfully");
  //     }
  //     if (!res.ok) throw new Error("Failed to delete match");
  //     setCompetitions((prev) => prev.filter((c) => c.id !== id));
  //   } catch (err) {
  //     alert(
  //       `Error deleting match.${
  //         err instanceof Error ? err.message : String(err)
  //       }`
  //     );
  //   }
  // };

  // const handleAdd = async () => {
  //   try {
  //     if (
  //       !form.match_date ||
  //       !form.match_time ||
  //       !form.location ||
  //       !form.sport_type_id ||
  //       !form.teamA_id ||
  //       !form.teamB_id
  //     ) {
  //       alert("Please fill in all required fields.");
  //       return;
  //     }

  //     const matchData = {
  //       match_date: form.match_date,
  //       match_time: form.match_time + ":00", // Fix time format
  //       location: form.location,
  //       sport_type_id: form.sport_type_id,
  //       teamA_id: form.teamA_id,
  //       teamB_id: form.teamB_id,
  //       status: form.status,
  //     };

  //     console.log("Sending POST request:", JSON.stringify(matchData));

  //     const res = await fetch(
  //       `/api/match_friendly/by-sport/${form.sport_type_id}`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(matchData),
  //       }
  //     );
  //     if (res.ok) {
  //       alert("Match added successfully!");
  //     }

  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       throw new Error(errorData.error || "Failed to add match");
  //     }

  //     await fetchCompetitions();

  //     setForm({
  //       match_date: "",
  //       match_time: "",
  //       location: "",
  //       sport_type_id: "",
  //       teamA_id: "",
  //       teamB_id: "",
  //       status: "scheduled",
  //     });
  //   } catch (err) {
  //     console.error("Error in handleAdd:", err);
  //     alert(
  //       `Error adding match: ${
  //         err instanceof Error ? err.message : String(err)
  //       }`
  //     );
  //   }
  // };

  const handleEdit = async () => {
    if (!editMatch) return;

    try {
      if (editForm.status === "completed") {
        if (editForm.teamA_score === null || editForm.teamB_score === null) {
          alert(
            "Both Team A and Team B scores must be provided for completed matches."
          );
          return;
        }
      }

      const res = await fetch(`/api/match_friendly/${editMatch.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editForm.status,
          teamA_score:
            editForm.status === "completed" ? editForm.teamA_score : null,
          teamB_score:
            editForm.status === "completed" ? editForm.teamB_score : null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update match");
      }

      await fetchCompetitions();
      setEditMatch(null);
      setEditForm({
        status: "scheduled",
        teamA_score: null,
        teamB_score: null,
      });
    } catch (err) {
      alert(
        `Error updating match: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  // const openEditModal = (match: Match_friendly) => {
  //   setEditMatch(match);
  //   setEditForm({
  //     status: match.status,
  //     teamA_score: match.teamA_score,
  //     teamB_score: match.teamB_score,
  //   });
  // };

  useEffect(() => {
    fetchCompetitions();
    fetchSportTypes();
    fetchTeams();
  }, [sport]);

  if (loading) return <p className="px-8 py-6">Loading competitions...</p>;
  if (error) return <p className="px-8 py-6 text-red-500">{error}</p>;

  return (
    <section className="px-8 py-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        🏟️ Match Dashboard
      </h2>

      {/* Match Form */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border">
        <h3 className="text-xl font-semibold mb-5 text-gray-800">
          ➕ Add New Match
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="date"
            name="match_date"
            value={form.match_date}
            onChange={handleInputChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="time"
            name="match_time"
            value={form.match_time}
            onChange={handleInputChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleInputChange}
            className="border p-3 rounded-xl"
            placeholder="📍 Location"
          />
          <select
            name="sport_type_id"
            value={form.sport_type_id}
            onChange={handleInputChange}
            className="border p-3 rounded-xl"
          >
            <option value="">🏅 Select Sport Type</option>
            {typeofsport.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </select>
          <select
            name="teamA_id"
            value={form.teamA_id}
            onChange={handleInputChange}
            className="border p-3 rounded-xl"
          >
            <option value="">Team A</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <select
            name="teamB_id"
            value={form.teamB_id}
            onChange={handleInputChange}
            className="border p-3 rounded-xl"
          >
            <option value="">Team B</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={form.status}
            onChange={handleInputChange}
            className="border p-3 rounded-xl"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="mt-6 text-right">
          <Button className="bg-green-600 text-white px-6 py-2 rounded-[5px] hover:bg-green-700 transition">
            Submit Match
          </Button>
        </div>
      </div>

      {/* Match Edit Modal */}
      {editMatch && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">✏️ Edit Match</h3>
            <div className="grid grid-cols-1 gap-4">
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditInputChange}
                className="border p-3 rounded-xl"
              >
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {editForm.status === "completed" && (
                <>
                  <input
                    type="number"
                    name="teamA_score"
                    value={editForm.teamA_score ?? ""}
                    onChange={handleEditInputChange}
                    className="border p-3 rounded-xl"
                    placeholder="Team A Score"
                  />
                  <input
                    type="number"
                    name="teamB_score"
                    value={editForm.teamB_score ?? ""}
                    onChange={handleEditInputChange}
                    className="border p-3 rounded-xl"
                    placeholder="Team B Score"
                  />
                </>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                onClick={() => setEditMatch(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Match Table */}
      <div className="overflow-auto bg-white rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-full text-base text-left">
          <thead className="bg-blue-900 text-white text-lg text-center">
            <tr>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Team A</th>
              <th className="px-6 py-4">Team B</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Sport</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {competitions.map((comp, index) => (
              <tr
                key={comp.id}
                className="hover:bg-blue-50 transition duration-300 text-center"
              >
                <td className=" px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 border-t">{comp.teamA?.name}</td>
                <td className="px-6 py-4 border-t">{comp.teamB?.name}</td>
                <td className="px-6 py-4 border-t">{comp.match_date}</td>
                <td className="px-6 py-4 border-t">{comp.match_time}</td>
                <td className="px-6 py-4 border-t">{comp.location}</td>
                <td className="px-6 py-4 border-t">{comp.sportType?.name}</td>
                <td className="px-6 py-4 border-t capitalize">{comp.status}</td>
                <td className="px-6 py-4 border-t">
                  {comp.status === "completed"
                    ? `${comp.teamA_score} - ${comp.teamB_score}`
                    : "N/A"}
                </td>
                <td className="px-6 py-4 border-t">
                  <div className="flex justify-center gap-3">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow">
                      Update
                    </Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg shadow">
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
