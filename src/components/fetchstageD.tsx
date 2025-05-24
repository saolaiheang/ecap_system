"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";

interface Stage {
    id: string;
    name: string;
    type: string;
    competitionId: string;
}
interface Matches{
    id: string;
    teamA_id:string;
    teamB_id:string;
    stage_id:string;
    teamA_name:string;
    teamB_name:string;
    teamA_score:string;
    teamB_score:string;

}
export default function CompetitionStages() {
    const { competitionId } = useParams();
    const [stages, setStages] = useState<Stage[]>([]);
    const [stageForm, setStageForm] = useState({ name: "", type: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectStage, setSelectStage] = useState<string>("")
    const [matches,setMatches]=useState<Matches[]>([])


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
                setError("Failed to load stages.");
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
                const res = await fetch(`/api/competitions/${competitionId}/stages/${selectStage}/matches`);
                const data = await res.json();
                console.log(data)
                setMatches(Array.isArray(data) ? data : []);
            } catch (err) {
                setError("Failed to load match.");
            }

        }
        fetchMatch()
    },[competitionId,selectStage])


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

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <button>Back</button>

            <h2 className="text-2xl font-bold mb-4">Stages for Competition</h2>
            <div className="bg-gray-100 p-4 rounded mb-6 ">
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
            <h3 className="text-lg font-semibold mb-2">Existing Stages</h3>
            <select name="" id=""     value={selectStage }
             onChange={(e) => setSelectStage(e.target.value)}
          >
                <option value="" >Select a Stage</option>

                {stages.length > 0 ? (stages.map((stage, index) => (
                    <option key={stage.id || index} value={stage.id}>{stage.name}</option>
                ))
                ) : (
                    <option className="text-gray-500 mt-2" disabled>No stage found for this stage.</option>
                )}
            </select>


            <h3 className="text-lg font-semibold mb-2">Matches for Selected Stage</h3>
      {matches.length > 0 ? (
        <div>
          {matches.map((match, index) => (
            <div key={match.id || index} className="border p-2 rounded mb-2">
              <p>Match {index + 1} (ID: {match.id})</p>
              {/* Add more match details as needed */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-2">
          {selectStage ? "No matches found for this stage." : "Please select a stage."}
        </p>
      )}
        </div>

    );
}
