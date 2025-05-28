"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Competition {
  id: string;
  name: string;
  location: string;
  start_date: string;
  image: string;
  sportType: SportType;
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
  const [editingCompetitionId, setEditingCompetitionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const competitionsPerPage = 5;

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

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setIsFetching(true);
        const res = await fetch("/api/competitions");
        if (!res.ok) throw new Error("Failed to fetch competitions");
        const data = await res.json();
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
      if (fileInputRef.current) fileInputRef.current.value = "";
      alert("Competition created successfully!");
    } catch (err) {
      console.error("Error creating competition:", err);
      setError("Failed to create competition. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (comp: Competition) => {
    setEditingCompetitionId(comp.id);
    setCompetitionForm({
      name: comp.name,
      location: comp.location,
      start_date: comp.start_date.split("T")[0],
      image: null,
    });
    setSelectedSportId(comp.sportType?.id || "");
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
      formDataPayload.append("image", competitionForm.image);
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
      if (fileInputRef.current) fileInputRef.current.value = "";
      alert("Competition updated successfully!");
    } catch (err) {
      console.error("Failed to update competition:", err);
      setError("Failed to update competition. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setCompetitionForm({ name: "", location: "", start_date: "", image: null });
    setSelectedSportId("");
    setEditingCompetitionId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleViewStages = (competitionId: string) => {
    router.push(`/competitions/${competitionId}/stages`);
  };

  // Pagination Logic
  const totalPages = Math.ceil(competitions.length / competitionsPerPage);
  const indexOfLastCompetition = currentPage * competitionsPerPage;
  const indexOfFirstCompetition = indexOfLastCompetition - competitionsPerPage;
  const currentCompetitions = competitions.slice(indexOfFirstCompetition, indexOfLastCompetition);

  return (
    <section className="px-8 py-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        🏆 Competition Manager
      </h2>

      {error && (
        <p className="text-red-500 mb-4 text-base font-medium" role="alert">
          {error}
        </p>
      )}

      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border flex flex-col">
        <h3 className="text-xl font-semibold mb-5 text-gray-800">
          {editingCompetitionId ? "✏️ Update Competition" : "➕ Create New Competition"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <select
            id="sportType"
            value={selectedSportId}
            onChange={(e) => setSelectedSportId(e.target.value)}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
            disabled={isLoading}
          >
            <option value="">🏅 Select Sport Type</option>
            {sportTypes.map((sport, index) => (
              <option key={sport.id || `sport-${index}`} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </select>

          <input
            name="name"
            type="text"
            placeholder="📛 Competition Name"
            value={competitionForm.name}
            onChange={handleCompetitionChange}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
            disabled={isLoading}
          />

          <input
            name="location"
            type="text"
            placeholder="📍 Location"
            value={competitionForm.location}
            onChange={handleCompetitionChange}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
            disabled={isLoading}
          />

          <input
            name="start_date"
            type="date"
            value={competitionForm.start_date}
            onChange={handleCompetitionChange}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
            disabled={isLoading}
          />

          <input
            name="image"
            type="file"
            onChange={handleFileChange}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
            ref={fileInputRef}
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-4 justify-end mt-6">
          {editingCompetitionId ? (
            <>
              <button
                onClick={() => handleUpdateClick(editingCompetitionId)}
                className="bg-green-600 text-white px-6 py-2 rounded-[5px] hover:bg-green-700 transition disabled:bg-green-300"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Competition"}
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 text-white px-6 py-2 rounded-[5px] hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleCreateCompetition}
              className="bg-green-600 text-white px-6 py-2 rounded-[5px] hover:bg-green-700 transition disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Competition"}
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        📋 All Competitions
      </h3>

      {isFetching ? (
        <p className="text-center text-gray-600">Loading competitions...</p>
      ) : currentCompetitions.length > 0 ? (
        <>
          <div className="overflow-auto bg-white rounded-2xl shadow-lg border border-gray-200">
            <table className="min-w-full text-base text-left border-collapse border border-gray-300">
              <thead className="bg-blue-900 text-white text-lg text-center">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Sport</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCompetitions.map((comp, index) => (
                  <tr
                    key={comp.id || `comp-${index}`}
                    className="text-center hover:bg-blue-50 transition duration-300"
                  >
                    <td className="px-4 py-3 border-t">{indexOfFirstCompetition + index + 1}</td>
                    <td className="px-6 py-4 border-t">{comp.name}</td>
                    <td className="px-6 py-4 border-t">{comp.location}</td>
                    <td className="px-6 py-4 border-t">
                      {new Date(comp.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 border-t">
                      {comp.image ? (
                        <Image
                          src={comp.image}
                          width={120}
                          height={100}
                          alt={comp.name}
                          className="object-cover rounded-lg mx-auto"
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td className="px-6 py-4 border-t">
                      {comp.sportType?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-t">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEditClick(comp)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow text-sm"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleViewStages(comp.id)}
                          className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-lg shadow text-sm"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700 pt-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">No competitions found.</p>
      )}
    </section>
  );
}
