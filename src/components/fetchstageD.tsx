
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "./button";

interface Stage {
  id: string;
  name: string;
  type: string;
  competitionId: string;
}

interface SportType {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
  division: string;
  contact_info: string;
  image: string;
}

interface Matches {
  id: string;
  teamA_id: string;
  teamB_id: string;
  stage_id: Stage;
  sport_type_id: SportType;
  location: string;
  match_date: string;
  match_time: string;
  status: string;
  teamA: Team;
  teamB: Team;
  teamA_score: string | null;
  teamB_score: string | null;
}

export default function CompetitionStages() {
  const { competitionId } = useParams();
  const [stages, setStages] = useState<Stage[]>([]);
  const [stageForm, setStageForm] = useState({ name: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [selectStage, setSelectStage] = useState<string>("");
  const [matches, setMatches] = useState<Matches[]>([]);
  const [sportTypes, setSportTypes] = useState<SportType[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [matchForm, setMatchForm] = useState({
    match_date: "",
    match_time: "",
    location: "",
    sport_type_id: "",
    teamA_id: "",
    teamB_id: "",
    status: "scheduled" as Matches["status"],
    teamA_score: null as string | null,
    teamB_score: null as string | null,
  });

  const router = useRouter();

  useEffect(() => {
    console.log("Extracted competitionId from params:", competitionId);
    if (!competitionId) {
      console.error("competitionId is undefined, redirecting to /competitions");
      router.push("/competitions");
    }
  }, [competitionId, router]);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching stages for competitionId:", competitionId);
        const res = await fetch(`/api/competitions/${competitionId}/stages`);
        const data = await res.json();
        console.log("Stages data:", data);
        setStages(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load stages.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStages();
  }, [competitionId]);

  useEffect(() => {
    const fetchMatch = async () => {
      if (!selectStage) return;
      try {
        setIsLoading(true);
        console.log("Fetching matches for stage:", selectStage);
        const res = await fetch(`/api/competitions/${competitionId}/stages/${selectStage}/match`);
        const data = await res.json();
        console.log("Matches data:", data.data);
        setMatches(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setMatchError("Failed to load matches.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatch();
  }, [competitionId, selectStage]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/team`);
        const data = await res.json();
        setTeams(data.data || []);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchSport = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/typeofsport");
        const data = await res.json();
        console.log("Sport types data:", data);
        setSportTypes(data.typeOfSport || []);
      } catch (err) {
        console.error("Failed to fetch sport types:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSport();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStageForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMatchInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMatchForm((prev) => ({
      ...prev,
      [name]: name === "teamA_score" || name === "teamB_score" ? (value ? value : null) : value,
    }));
  };

  const handleCreateStage = async () => {
    if (!stageForm.name || !stageForm.type) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/competitions/${competitionId}/stages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...stageForm,
          competitionId,
        }),
      });

      const newStage = await res.json();
      
      setStages((prev) => (Array.isArray(prev) ? [...prev, newStage] : [newStage]));
      setStageForm({ name: "", type: "" });
    } catch (err) {
      console.error("Error creating stage:", err);
      const error = err as Error;
      setError(error.message || "Failed to create stage.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMatch = async () => {
    if (!matchForm.match_date || !matchForm.match_time || !matchForm.location || !matchForm.sport_type_id || !matchForm.teamA_id || !matchForm.teamB_id) {
      setMatchError("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`/api/competitions/${competitionId}/stages/${selectStage}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...matchForm,
          teamA_score: null,
          teamB_score: null,
        }),
      });
      const data = await res.json();
     

      setMatches((prev) => [...prev, data.data]);
      setShowMatchForm(false);
      setMatchForm({
        match_date: "",
        match_time: "",
        location: "",
        sport_type_id: "",
        teamA_id: "",
        teamB_id: "",
        status: "scheduled",
        teamA_score: null,
        teamB_score: null,
      });
    } catch (err) {
      console.error("Error creating match:", err);
      const error = err as Error;
      setMatchError(error.message || "Failed to create match.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMatch = async () => {
    if (!editingMatchId) {
      setMatchError("No match selected for update.");
      return;
    }
    if (!matchForm.match_date || !matchForm.match_time || !matchForm.location || !matchForm.sport_type_id || !matchForm.teamA_id || !matchForm.teamB_id) {
      setMatchError("Please fill in all required fields.");
      return;
    }
    if (matchForm.status === "completed" && (matchForm.teamA_score === null || matchForm.teamB_score === null)) {
      setMatchError("Scores are required when status is completed.");
      return;
    }
    if (matchForm.status === "scheduled" && (matchForm.teamA_score !== null || matchForm.teamB_score !== null)) {
      setMatchError("Scores must be null when status is scheduled.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`/api/competitions/${competitionId}/stages/${selectStage}/match/${editingMatchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_date: matchForm.match_date,
          match_time: matchForm.match_time,
          location: matchForm.location,
          status: matchForm.status,
          teamA_score: matchForm.status === "completed" ? matchForm.teamA_score : null,
          teamB_score: matchForm.status === "completed" ? matchForm.teamB_score : null,
        }),
      });

      const data = await res.json();
     

      setMatches((prev) =>
        prev.map((match) => (match.id === editingMatchId ? { ...match, ...data.data } : match))
      );
      setShowMatchForm(false);
      setEditingMatchId(null);
      setMatchForm({
        match_date: "",
        match_time: "",
        location: "",
        sport_type_id: "",
        teamA_id: "",
        teamB_id: "",
        status: "scheduled",
        teamA_score: null,
        teamB_score: null,
      });
    } catch (err) {
      console.error("Error updating match:", err);
      const error = err as Error;
      setMatchError(error.message || "Failed to update match.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMatch = (matchId: string) => {
    const matchToUpdate = matches.find((match) => match.id === matchId);
    if (!matchToUpdate) {
      setMatchError("Match not found.");
      return;
    }

    setEditingMatchId(matchId);
    setMatchForm({
      match_date: matchToUpdate.match_date,
      match_time: matchToUpdate.match_time,
      location: matchToUpdate.location,
      sport_type_id: matchToUpdate.sport_type_id.id,
      teamA_id: matchToUpdate.teamA_id,
      teamB_id: matchToUpdate.teamB_id,
      status: matchToUpdate.status || "scheduled",
      teamA_score: matchToUpdate.teamA_score,
      teamB_score: matchToUpdate.teamB_score,
    });
    setShowMatchForm(true);
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm("Are you sure you want to delete this match?")) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/competitions/${competitionId}/stages/${selectStage}/match/${matchId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
   
      setMatches((prev) => prev.filter((match) => match.id !== matchId));
    } catch (err) {
      console.error("Error deleting match:", err);
      const error = err as Error;
      setMatchError(error.message || "Failed to delete match.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 max-w-7xl mx-auto">
      <button onClick={() => router.back()} className="text-white rounded bg-gray-600 px-4 py-2 mb-4">
        Back
      </button>
      <h2 className="text-2xl font-bold mb-4">Stages for Competition</h2>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="text-lg font-semibold mb-2">Create New Stage</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="gap-3 flex">
          <input
            type="text"
            name="name"
            placeholder="Stage Name (e.g. វគ្គចែកប៉ូល)"
            value={stageForm.name}
            onChange={handleInputChange}
            className="border p-2 rounded mb-2 w-full"
          />
          <select
            name="type"
            value={stageForm.type}
            onChange={handleInputChange}
            className="border p-2 rounded mb-2 w-full"
          >
            <option value="">Select Stage</option>
            <option value="group">Group</option>
            <option value="semifinal">Semifinal</option>
            <option value="final">Final</option>
          </select>
        </div>
        <button
          onClick={handleCreateStage}
          className="bg-blue-500 hover:bg-blue-700 text-white rounded px-4 py-2"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Stage"}
        </button>
      </div>
      <h3 className="text-lg mb-2">Existing Stages</h3>
      <select
        value={selectStage}
        className="px-4 py-2 bg-stone-400 rounded mb-4"
        onChange={(e) => setSelectStage(e.target.value)}
      >
        <option value="">Select a Stage</option>
        {stages.length > 0 ? (
          stages.map((stage, index) => (
            <option key={stage.id || index} value={stage.id}>
              {stage.name}
            </option>
          ))
        ) : (
          <option className="text-gray-500" disabled>
            No stages found.
          </option>
        )}
      </select>

      {showMatchForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editingMatchId ? "Edit Match" : "Create Match"}</h2>
            {matchError && <p className="text-red-500 mb-4">{matchError}</p>}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="date"
                name="match_date"
                value={matchForm.match_date}
                onChange={handleMatchInputChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="time"
                name="match_time"
                value={matchForm.match_time}
                onChange={handleMatchInputChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={matchForm.location}
                onChange={handleMatchInputChange}
                className="border p-2 rounded"
                required
              />
              <select
                name="sport_type_id"
                value={matchForm.sport_type_id}
                onChange={handleMatchInputChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Sport Type</option>
                {sportTypes.length > 0 ? (
                  sportTypes.map((sport, index) => (
                    <option key={sport.id || index} value={sport.id}>
                      {sport.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Sport not found
                  </option>
                )}
              </select>
              <select
                name="teamA_id"
                value={matchForm.teamA_id}
                onChange={handleMatchInputChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Team A</option>
                {teams.length > 0 ? (
                  teams.map((team, index) => (
                    <option value={team.id} key={team.id || index}>
                      {team.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Team not found
                  </option>
                )}
              </select>
              <select
                name="teamB_id"
                value={matchForm.teamB_id}
                onChange={handleMatchInputChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Team B</option>
                {teams.length > 0 ? (
                  teams.map((team, index) => (
                    <option value={team.id} key={team.id || index}>
                      {team.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Team not found
                  </option>
                )}
              </select>
              <select
                name="status"
                value={matchForm.status}
                onChange={handleMatchInputChange}
                className="border p-2 rounded col-span-2"
              >
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input
                type="number"
                name="teamA_score"
                placeholder="Team A Score"
                value={matchForm.teamA_score ?? ""}
                onChange={handleMatchInputChange}
                className="border p-2 rounded"
                required={matchForm.status === "completed"}
                disabled={matchForm.status === "scheduled"}
              />
              <input
                type="number"
                name="teamB_score"
                placeholder="Team B Score"
                value={matchForm.teamB_score ?? ""}
                onChange={handleMatchInputChange}
                className="border p-2 rounded"
                required={matchForm.status === "completed"}
                disabled={matchForm.status === "scheduled"}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowMatchForm(false);
                  setEditingMatchId(null);
                  setMatchForm({
                    match_date: "",
                    match_time: "",
                    location: "",
                    sport_type_id: "",
                    teamA_id: "",
                    teamB_id: "",
                    status: "scheduled",
                    teamA_score: null,
                    teamB_score: null,
                  });
                  setMatchError(null);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={editingMatchId ? handleUpdateMatch : handleCreateMatch}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : editingMatchId ? "Update Match" : "Create Match"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <h3 className="text-lg font-semibold mb-2">Matches for Selected Stage</h3>
        <button
          onClick={() => {
            setEditingMatchId(null);
            setMatchForm({
              match_date: "",
              match_time: "",
              location: "",
              sport_type_id: "",
              teamA_id: "",
              teamB_id: "",
              status: "scheduled",
              teamA_score: null,
              teamB_score: null,
            });
            setShowMatchForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded my-4"
        >
          Create Match
        </button>
      </div>
      {matchError && <p className="text-red-500 mb-2">{matchError}</p>}
      {matches.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Team A</th>
                <th className="border px-4 py-2">Team B</th>
                <th className="border px-4 py-2">Location</th>
                <th className="border px-4 py-2">Date/Time</th>
                <th className="border px-4 py-2">Score A</th>
                <th className="border px-4 py-2">Score B</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match, index) => (
                <tr key={match.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{match.teamA?.name || "Unknown"}</td>
                  <td className="border px-4 py-2">{match.teamB?.name || "Unknown"}</td>
                  <td className="border px-4 py-2">{match.location}</td>
                  <td className="border px-4 py-2">
                    {new Date(match.match_date).toLocaleDateString()} ({match.match_time})
                  </td>
                  <td className="border px-4 py-2">{match.teamA_score ?? "N/A"}</td>
                  <td className="border px-4 py-2">{match.teamB_score ?? "N/A"}</td>
                  <td className="border px-4 py-2">{match.status}</td>
                  <td className="px-4 py-2 border-b flex gap-1 justify-center">
                    <Button
                      onClick={() => handleEditMatch(match.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1"
                      disabled={isLoading}
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => handleDeleteMatch(match.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1"
                      disabled={isLoading}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 mt-2">
          {selectStage ? "No matches found for this stage." : "Please select a stage."}
        </p>
      )}
    </div>
  );
}