
"use client";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
interface Competition {
  id: string;
  name: string;
  location: string;
  start_date: string;
  image: string;
  status: string; // Added for status column
}

interface SportType {
  id: string;
  name: string;
}

export default function CompetitionManager() {
  const [sportTypes, setSportTypes] = useState<SportType[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [competitionForm, setCompetitionForm] = useState({
    name: "",
    location: "",
    start_date: "",
    image: null as File | null,
  });
  const [selectedSportId, setSelectedSportId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCompetitionId, setEditingCompetitionId] = useState<string | null>(null); // For edit mode
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSportTypes = async () => {
      try {
        const res = await fetch("/api/typeofsport");
        if (!res.ok) throw new Error("Failed to fetch sport types");
        const data = await res.json();
        setSportTypes(data.typeOfSport || []);
      } catch (err) {
        console.error("Failed to fetch sport types:", err);
        setError("Failed to load sport types. Please try again.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchSportTypes();
  }, []);

  // Fetch all competitions
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setIsFetching(true);
        const res = await fetch("/api/competitions");
        if (!res.ok) throw new Error("Failed to fetch competitions");
        const data = await res.json();
        console.log("Competitions:", data);
        setCompetitions(data.data || []);
      } catch (err) {
        console.error("Failed to fetch competitions:", err);
        setError("Failed to load competitions. Please try again.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchCompetitions();
  }, []);

  const handleCompetitionChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompetitionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCompetitionForm({ ...competitionForm, image: e.target.files[0] });
    }
  };

  const handleCreateCompetition = async () => {
    if (!selectedSportId) {
      setError("Please select a sport type.");
      return;
    }
    if (!competitionForm.name || !competitionForm.location || !competitionForm.start_date || !competitionForm.image) {
      setError("Please fill in all required fields, including an image.");
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append("name", competitionForm.name);
    formDataPayload.append("location", competitionForm.location);
    formDataPayload.append("start_date", competitionForm.start_date);
    formDataPayload.append("image", competitionForm.image);
    formDataPayload.append("sport_type_id", selectedSportId);

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/competitions", {
        method: "POST",
        body: formDataPayload,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create competition.");
      }

      const newComp = await res.json();
      setCompetitions((prev) => [...prev, newComp]);
      setCompetitionForm({ name: "", location: "", start_date: "", image: null });
      setSelectedSportId("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      alert("Competition created successfully!");
    } catch (err) {
      console.error("Error creating competition:", err);
      setError( `Failed to create competition. Please try again.${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (comp: Competition) => {
    setEditingCompetitionId(comp.id);
    setCompetitionForm({
      name: comp.name,
      location: comp.location,
      start_date: comp.start_date.split("T")[0], // Format for date input
      image: null, // Image reset, user must re-upload
    });
    setSelectedSportId(selectedSportId || ""); // Assuming sport_type_id is returned
  };

  const handleUpdateClick = async (id: string) => {
    if (!selectedSportId) {
      setError("Please select a sport type.");
      return;
    }
    if (!competitionForm.name || !competitionForm.location || !competitionForm.start_date) {
      setError("Please fill in all required fields.");
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append("name", competitionForm.name);
    formDataPayload.append("location", competitionForm.location);
    formDataPayload.append("start_date", competitionForm.start_date);
    if (competitionForm.image) {
      formDataPayload.append("image", competitionForm.image); // Image is optional
    }
    formDataPayload.append("sport_type_id", selectedSportId);

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/competitions/${id}`, {
        method: "PUT",
        body: formDataPayload,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update competition.");
      }

      const updatedCompetition = await res.json();
      setCompetitions((prev) =>
        prev.map((com) => (com.id === id ? updatedCompetition : com))
      );
      setCompetitionForm({ name: "", location: "", start_date: "", image: null });
      setSelectedSportId("");
      setEditingCompetitionId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      alert("Competition updated successfully!");
    } catch (err) {
      console.error("Failed to update competition:", err);
      setError( `Failed to update competition. Please try again.${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancelEdit = () => {
    setCompetitionForm({ name: "", location: "", start_date: "", image: null });
    setSelectedSportId("");
    setEditingCompetitionId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleViewStages = (competitionId: string) => {
    router.push(`/competitions/${competitionId}/stages`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Competition Manager</h2>
      {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}

      <div className="mb-8 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          {editingCompetitionId ? "Update Competition" : "Create New Competition"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sportType" className="block text-sm font-medium mb-1">Sport Type</label>
            <select
              id="sportType"
              value={selectedSportId}
              onChange={(e) => setSelectedSportId(e.target.value)}
              className="border p-2 rounded w-full"
              disabled={isLoading}
            >
              <option value="">Select Sport Type</option>
              {sportTypes.map((sport, index) => (
                <option key={sport.id || `sport-${index}`} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Competition Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Competition Name"
              value={competitionForm.name}
              onChange={handleCompetitionChange}
              className="border p-2 rounded w-full"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="Location"
              value={competitionForm.location}
              onChange={handleCompetitionChange}
              className="border p-2 rounded w-full"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium mb-1">Start Date</label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              value={competitionForm.start_date}
              onChange={handleCompetitionChange}
              className="border p-2 rounded w-full"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-1">Image</label>
            <input
              id="image"
              name="image"
              type="file"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
              ref={fileInputRef}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          {editingCompetitionId ? (
            <>
              <button
                onClick={() => handleUpdateClick(editingCompetitionId)}
                className="bg-green-600 text-white px-4 py-2 rounded w-full md:w-auto disabled:bg-green-300"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Competition"}
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 text-white px-4 py-2 rounded w-full md:w-auto disabled:bg-gray-300"
                disabled={isLoading}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleCreateCompetition}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Competition"}
            </button>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">All Competitions</h3>
      {isFetching ? (
        <p className="text-gray-500">Loading competitions...</p>
      ) : competitions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {competitions.map((comp, index) => (
                <tr key={comp.id || `comp-${index}`}>
                    <td className="px-4 py-3 border-t">{index + 1}</td>

                  <td className="px-6 py-4 whitespace-nowrap">{comp.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{comp.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(comp.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {comp.image ? (
                      <Image src={comp.image} alt={comp.name} className="h-12 w-12 object-cover rounded" />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{comp.status || "Active"}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button
                      onClick={() => handleEditClick(comp)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleViewStages(comp.id)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      View Stages
                    </button>
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No competitions found.</p>
      )}
    </div>
  );
}