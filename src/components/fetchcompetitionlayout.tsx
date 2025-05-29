// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";

// interface SportType {
//   id: string;
//   name: string;
//   image: string;
//   description: string;
// }

// interface Competition {
//   id: string;
//   name: string;
//   sport_type_id: string;
//   start_date: string;
//   location: string;
//   image: string | null;
//   sportType: SportType;
// }

// export default function FetchCompetitionLayout() {
//   const [competitions, setCompetitions] = useState<Competition[]>([]);

//   useEffect(() => {
//     async function fetchCompetitions() {
//       try {
//         const res = await fetch("/api/competitions", 
//           { cache: "no-store" });
//         if (!res.ok) throw new Error("Failed to fetch competitions");
//         const json = await res.json();
//         setCompetitions(json.data);
//       } catch (error) {
//         console.error("Error fetching competitions:", error);
//       }
//     }

//     fetchCompetitions();
//   }, []);

//   return (
//     <div className="px-[150px]">
//       <h1 className="text-3xl font-bold mb-6 text-purple-700">Competitions</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {competitions.map((competition) => (
//           <div
//             key={competition.id}
//             className="rounded-2xl shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="p-4">
//               <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
//                 <Image
//                   src={competition.image || competition.sportType.image}
//                   alt={competition.name}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-800">
//                 {competition.name}
//               </h2>
//               <p className="text-sm text-gray-500">
//                 🏟️ {competition.location}
//               </p>
//               <p className="text-sm text-gray-500">
//                 🗓️ {competition.start_date}
//               </p>
//               <p className="text-sm mt-2 text-purple-600">
//                 Sport: {competition.sportType.name}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface SportType {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface Team {
  id: string;
  name: string;
}

interface Match {
  id: string;
  match_date: string;
  match_time: string;
  location: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  stage_id: string;
  sport_type_id: string;
  teamA_id: string;
  teamB_id: string;
  teamA_score: number | null;
  teamB_score: number | null;
  teamA: Team;
  teamB: Team;
}

interface Stage {
  id: string;
  name: string;
  type: "group" | "semifinal" | "final";
  competition_id: string;
  matches: Match[];
}

interface Competition {
  id: string;
  name: string;
  sport_type_id: string;
  start_date: string;
  location: string;
  image: string | null;
  sportType: SportType;
  stages: Stage[];
}

export default function FetchCompetitionLayout() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [sports, setSports] = useState<SportType[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCompetition, setExpandedCompetition] = useState<string | null>(null);

  // Fetch sports for filtering
  useEffect(() => {
    async function fetchSports() {
      try {
        const res = await fetch("/api/typeofsport", { cache: "no-store" });
        
        const data = await res.json();
        console.log("Sports API Response:", data);
        setSports(data.typeOfSport || []);
      } catch (err) {
        console.error("Failed to fetch sports:", err);
        setSports([]);
        setError("Failed to load sports. Please try again.");
      }
    }
    fetchSports();
  }, []);

  // Fetch competitions, stages, and matches when selectedSport changes
  useEffect(() => {
    async function fetchCompetitions() {
      setLoading(true);
      setError(null);
      try {
        const url = selectedSport
          ? `/api/competitions?sport_type_id=${selectedSport}`
          : "/api/competitions";
        const res = await fetch(url, { cache: "no-store" });
        const json = await res.json();
        console.log("Competitions API Response:", json);
        const competitionsData = json.data || [];

        // Fetch stages and matches for each competition
        const competitionsWithStages = await Promise.all(
          competitionsData.map(async (competition: Competition) => {
            try {
              const stagesRes = await fetch(`/api/competitions/${competition.id}/stages`, {
                cache: "no-store",
              });
           
              const stagesData = await stagesRes.json();
              console.log(`Stages for competition ${competition.id}:`, stagesData);

              // Handle stagesData as an array directly
              const stagesArray = Array.isArray(stagesData) ? stagesData : stagesData.stages || [];

              // Fetch matches for each stage
              const stagesWithMatches = await Promise.all(
                stagesArray.map(async (stage: Stage) => {
                  try {
                    const matchesRes = await fetch(
                      `/api/competitions/${competition.id}/stages/${stage.id}/match`,
                      { cache: "no-store" }
                    );
                    const matchesData = await matchesRes.json();
                    console.log(`Matches for stage ${stage.id}:`, matchesData);
                    return { ...stage, matches: matchesData.data || [] };
                  } catch (err) {
                    console.error(`Error fetching matches for stage ${stage.id}:`, err);
                    return { ...stage, matches: [] };
                  }
                })
              );

              return { ...competition, stages: stagesWithMatches };
            } catch (err) {
              console.error(`Error fetching stages for competition ${competition.id}:`, err);
              return { ...competition, stages: [] };
            }
          })
        );

        console.log("Competitions with Stages and Matches:", competitionsWithStages);
        setCompetitions(competitionsWithStages);
      } catch (error) {
        console.error("Error fetching competitions:", error);
        setError("Failed to load competitions. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCompetitions();
  }, [selectedSport]);

  const toggleCompetition = (competitionId: string) => {
    console.log("Toggling competition:", competitionId, "Current expanded:", expandedCompetition);
    setExpandedCompetition(expandedCompetition === competitionId ? null : competitionId);
  };

  return (
    <div className="px-8 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Competitions</h1>

      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-2">
        <label className="text-sm font-medium">Select a Sport:</label>
        <select
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedSport}
          onChange={(e) => {
            console.log("Selected sport:", e.target.value);
            setSelectedSport(e.target.value);
          }}
        >
          <option value="">All Sports</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">Loading competitions...</p>}
      {error && (
        <div>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => setSelectedSport(selectedSport)} // Trigger re-fetch
            className="text-blue-600 hover:underline text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && competitions.length === 0 && (
        <p className="text-gray-500">No competitions found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((competition) => (
          <div
            key={competition.id}
            className="rounded-2xl shadow-lg hover:shadow-xl transition-all bg-white"
          >
            <div className="p-4">
              <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src={competition.image || competition.sportType.image || "/fallback-image.jpg"}
                  alt={competition.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{competition.name}</h2>
              <p className="text-sm text-gray-500">🏟️ {competition.location}</p>
              <p className="text-sm text-gray-500">
                🗓️ {new Date(competition.start_date).toLocaleDateString()}
              </p>
              <p className="text-sm mt-2 text-purple-600">
                Sport: {competition.sportType.name}
              </p>
              <button
                onClick={() => toggleCompetition(competition.id)}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {expandedCompetition === competition.id ? "Hide Stages" : "Show Stages"}
              </button>

              {expandedCompetition === competition.id && (
                <div className="mt-4">
                  {competition.stages.length === 0 ? (
                    <p className="text-gray-500 text-sm">No stages available for this competition.</p>
                  ) : (
                    competition.stages.map((stage) => (
                      <div key={stage.id} className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                          {stage.name} ({stage.type.charAt(0).toUpperCase() + stage.type.slice(1)})
                        </h3>
                        {stage.matches.length === 0 ? (
                          <p className="text-gray-500 text-sm">No matches available.</p>
                        ) : (
                          <ul className="mt-2 space-y-2">
                            {stage.matches.map((match) => (
                              <li
                                key={match.id}
                                className="text-sm text-gray-600 border-t pt-2"
                              >
                                <div className="flex justify-between">
                                  <span>
                                    {(match.teamA?.name || "Unknown Team")} vs{" "}
                                    {(match.teamB?.name || "Unknown Team")}
                                  </span>
                                  <span>
                                    {match.status === "completed" &&
                                    match.teamA_score !== null &&
                                    match.teamB_score !== null
                                      ? `(${match.teamA_score} - ${match.teamB_score})`
                                      : "(Score TBD)"}
                                  </span>
                                </div>
                                <div className="text-gray-500">
                                  <span>
                                    🗓️ {new Date(match.match_date).toLocaleDateString()}
                                  </span>
                                  <span className="ml-2">🕒 {match.match_time}</span>
                                  <span className="ml-2">🏟️ {match.location}</span>
                                 
                                </div>
                                <span
                                    className={`ml-2 ${
                                      match.status === "completed"
                                        ? "text-green-600"
                                        : match.status === "in_progress"
                                        ? "text-yellow-600"
                                        : match.status === "cancelled"
                                        ? "text-red-600"
                                        : "text-blue-600"
                                    }`}
                                  >
                                    Status: {match.status}
                                  </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}