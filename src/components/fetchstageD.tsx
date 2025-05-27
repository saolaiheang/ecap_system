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
  teamA: Team;
  teamB: Team;
  teamA_score: string;
  teamB_score: string;
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
  const [matchForm, setMatchForm] = useState({
    match_date: "",
    match_time: "",
    location: "",
    sport_type_id: "",
    teamA_id: "",
    teamB_id: "",
    status: "scheduled",
  });
  const router = useRouter();
  useEffect(() => {
    console.log("Extracted competitionId from params:", competitionId);
    if (!competitionId) {
      console.error("competitionId is undefined, redirecting to /competitions");
    }
  }, [competitionId]);
  useEffect(() => {
    const fetchStages = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching stages for competitionId:", competitionId);
        const res = await fetch(`/api/competitions/${competitionId}/stages`);
        const data = await res.json();
        console.log(data);
        setStages(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load stages.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStages();
  }, [competitionId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStageForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchMatch = async () => {
      if (!selectStage) return;
      try {
        setIsLoading(true);
        console.log("Fetching match for competitionId:", competitionId);
        const res = await fetch(
          `/api/competitions/${competitionId}/stages/${selectStage}/match`
        );
        const data = await res.json();
        console.log(data.data);
        setMatches(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.log(err);
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
        const res = await fetch(`/api/team`);
        const data = await res.json();
        setTeams(data.data || []);
      } catch (err) {
        console.error("Failed to fetch teams.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchSport = async () => {
      try {
        const res = await fetch("/api/typeofsport");
        const data = await res.json();
        console.log(data);
        setSportTypes(data.typeOfSport || []);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSport();
  }, []);

  const handleCreateStage = async () => {
    if (!stageForm.name) {
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
      if (!res.ok) {
        throw new Error(newStage.message || "Field to create stage......");
      }
      setStages((prev) =>
        Array.isArray(prev) ? [...prev, newStage] : [newStage]
      );
      setStageForm({ name: "", type: "" });
    } catch (err) {
      console.log(err);
      const error = err as Error;
      setError(error.message || "Field to create stage......");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatchInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMatchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateMatch = async () => {
    try {
      const res = await fetch(
        `/api/competitions/${competitionId}/stages/${selectStage}/match`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...matchForm,
            teamA_score: null,
            teamB_score: null,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create match.");
      }

      setMatches((prev) => [...prev, data.data]);
      setShowMatchForm(false);
      setMatchForm({
        match_date: "",
        match_time: "",
        location: "",
        sport_type_id: "",
        teamA_id: "",
        teamB_id: "",

      });
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to create match.");
    }
  };

  return (
    <div className=" max-w-4xl mx-auto py-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="text-white bg-gray-600 hover:bg-gray-700 rounded px-4 py-2 mb-4"
      >
        Back
      </button>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Stages for Competition</h2>

      {/* Create Stage Form */}
      <div className="bg-gray-100 p-6 rounded mb-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Create New Stage</h3>
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Stage Name (e.g. វគ្គចែកប៉ូល)"
            value={stageForm.name}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <select
            name="type"
            value={stageForm.type}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded w-full"
          >
            <option value="">Select Stage</option>
            <option value="group">Group</option>
            <option value="semifinal">Semifinal</option>
            <option value="final">Final</option>
          </select>

    });
    const router = useRouter();
    useEffect(() => {
        console.log("Extracted competitionId from params:", competitionId);
        if (!competitionId) {
            console.error("competitionId is undefined, redirecting to /competitions");
        }
    }, [competitionId]);
    useEffect(() => {
        const fetchStages = async () => {
            try {
                setIsLoading(true);
                console.log("Fetching stages for competitionId:", competitionId);
                const res = await fetch(`/api/competitions/${competitionId}/stages`);
                const data = await res.json();
                console.log(data)
                setStages(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError("Failed to load stages.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStages();
    }, [competitionId]);



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setStageForm((prev) => ({ ...prev, [name]: value }));
    };


    useEffect(() => {

        const fetchMatch = async () => {
            if (!selectStage) return;
            try {
                setIsLoading(true);
                console.log("Fetching match for competitionId:", competitionId);
                const res = await fetch(`/api/competitions/${competitionId}/stages/${selectStage}/match`);
                const data = await res.json();
                console.log(data.data)
                setMatches(Array.isArray(data.data) ? data.data : []);
            } catch (err) {
                console.log(err)
                setMatchError("Failed to load matches.");
            } finally {
                setIsLoading(false);
            }

        }
        fetchMatch()
    }, [competitionId, selectStage]);


    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await fetch(`/api/team`);
                const data = await res.json();
                setTeams(data.data || []);
            } catch (err) {
                console.error(err)
                console.error("Failed to fetch teams.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeams();
    }, []);

    useEffect(() => {
        const fetchSport = async () => {
            try {
                const res = await fetch('/api/typeofsport');
                const data = await res.json();
                console.log(data)
                setSportTypes(data.typeOfSport || [])
            } catch (err) {
                console.log(err)
            } finally {
                setIsLoading(false);
            }
        }
        fetchSport()
    }, []);





    const handleCreateStage = async () => {
        if (!stageForm.name) {
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
            if (!res.ok) {
                throw new Error(newStage.message || "Field to create stage......");
            }
            setStages((prev) => (Array.isArray(prev) ? [...prev, newStage] : [newStage]));
            setStageForm({ name: "", type: "" });
        } catch (err) {
            console.log(err)
            const error = err as Error;
            setError(error.message || "Field to create stage......");

        } finally {
            setIsLoading(false);
        }
    };



    const handleMatchInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMatchForm(prev => ({ ...prev, [name]: value }));
    };


    const handleCreateMatch = async () => {
        try {
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
            if (!res.ok) {
                throw new Error(data.message || "Failed to create match.");
            }

            setMatches(prev => [...prev, data.data]);
            setShowMatchForm(false);
            setMatchForm({
                match_date: "",
                match_time: "",
                location: "",
                sport_type_id: "",
                teamA_id: "",
                teamB_id: "",
                status: "scheduled",
            });
        } catch (err) {
            const error = err as Error;
            setError(error.message || "Failed to create match.");

        }
    };




    return (
        <div className="px-6 max-w-3xl mx-auto">
            <button onClick={() => router.back()} className="text-white rounded bg-gray-600">Back</button>
            <h2 className="text-2xl font-bold mb-2">Stages for Competition</h2>
            <div className="bg-gray-100 p-4 rounded mb-2 ">
                <h3 className="text-lg font-semibold ">Create New Stage</h3>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="gap-3 flex  ">
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
                    className="bg-blue-500 hover:bg-blue-700 text-white rounded px-4"

                >
                    {isLoading ? "Create" : "creating...."}
                </button>

            </div>
            <h3 className="text-lg mb-2">Existing Stages</h3>

            <select name="" id="" value={selectStage} className="px-4 py-2 bg-stone-400 rounded"
                onChange={(e) => setSelectStage(e.target.value)}
            >
                <option value="" >Select a Stage</option>


        <button
          onClick={handleCreateStage}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2"
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
      </div>

      {/* Select Stage */}
      <h3 className="text-lg font-semibold mb-2">Existing Stages</h3>
      <select
        value={selectStage}
        className="w-full sm:w-1/2 px-4 py-2 bg-stone-300 rounded mb-6"
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
          <option disabled>No stage found.</option>
        )}
      </select>

      {/* Create Match Modal */}
      {showMatchForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4">Create Match</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <input
                type="date"
                name="match_date"
                value={matchForm.match_date}
                onChange={handleMatchInputChange}
                className="border border-gray-300 p-2 rounded"
              />
              <input
                type="time"
                name="match_time"
                value={matchForm.match_time}
                onChange={handleMatchInputChange}
                className="border border-gray-300 p-2 rounded"
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={matchForm.location}
                onChange={handleMatchInputChange}
                className="border border-gray-300 p-2 rounded"
              />
              <select
                name="sport_type_id"
                onChange={handleMatchInputChange}
                value={matchForm.sport_type_id}
                className="border border-gray-300 p-2 rounded"
              >
                <option value="">Select Sport Type</option>
                {sportTypes.length > 0 ? (
                  sportTypes.map((sport, index) => (
                    <option key={sport.id || index} value={sport.id}>
                      {sport.name}
                    </option>
                  ))
                ) : (
                  <option value="">Sport not found</option>
                )}
              </select>
              <select
                name="teamA_id"
                value={matchForm.teamA_id}
                onChange={handleMatchInputChange}
                className="border border-gray-300 p-2 rounded"
              >
                <option value="">Select Team A</option>
                {teams.map((team, index) => (
                  <option value={team.id} key={team.id || index}>
                    {team.name}
                  </option>
                ))}
              </select>
              <select
                name="teamB_id"
                value={matchForm.teamB_id}
                onChange={handleMatchInputChange}
                className="border border-gray-300 p-2 rounded"
              >
                <option value="">Select Team B</option>
                {teams.map((team, index) => (
                  <option value={team.id} key={team.id || index}>
                    {team.name}
                  </option>
                ))}
              </select>
              <select
                name="status"
                value={matchForm.status}
                onChange={handleMatchInputChange}
                className="border border-gray-300 p-2 rounded col-span-2"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowMatchForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMatch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Matches Section */}
      <div className="flex justify-between items-center mt-8 mb-4">
        <h3 className="text-lg font-semibold">Matches for Selected Stage</h3>
        <button
          onClick={() => setShowMatchForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Create Match
        </button>
      </div>

      {matchError && <p className="text-red-500 mb-3">{matchError}</p>}

      {matches.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Team A</th>
                <th className="border px-4 py-2">Team B</th>
                <th className="border px-4 py-2">Location</th>
                <th className="border px-4 py-2">Date & Time</th>
                <th className="border px-4 py-2">Score A</th>
                <th className="border px-4 py-2">Score B</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match, index) => (
                <tr key={match.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{match.teamA.name}</td>
                  <td className="border px-4 py-2">{match.teamB.name}</td>
                  <td className="border px-4 py-2">{match.location}</td>
                  <td className="border px-4 py-2">
                    {match.match_date} ({match.match_time})
                  </td>
                  <td className="border px-4 py-2">
                    {match.teamA_score ?? "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {match.teamB_score ?? "N/A"}
                  </td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      onClick={() => {}}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {}}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">
          {selectStage
            ? "No matches found for this stage."
            : "Please select a stage."}
        </p>
      )}
    </div>
  );
}
