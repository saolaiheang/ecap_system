"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
interface Sport {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

interface Coaches {
  id: string;
  name: string;
  contact_info: string;
  image: string;
  team: {
    name: string;
    division: string;
    contact_info: string;
  };
}

export default function CoachesProfileBySport() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [coaches, setCoaches] = useState<Coaches[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedCoaches, setSelectedCoaches] = useState<Coaches | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    contact_info: "",
    image: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleAddCoaches = async () => {
    if (!selectedSport) return alert("Please select a sport type");
    const formDataPayload = new FormData();
    formDataPayload.append("name", formData.name);
    formDataPayload.append("contact_info", formData.contact_info);
    formDataPayload.append("team_id", selectedTeam);
    formDataPayload.append("sport_id", selectedSport);
    formDataPayload.append("image", formData.image);
    try {
      const res = await fetch(`/api/coaches/by-team/${selectedTeam}`, {
        method: "POST",
        body: formDataPayload,
      });
      if (res.ok) {
        const newPlayer = await res.json();
        setCoaches((prev) => [...prev, newPlayer]);
        alert("Coach added successfully");
        setFormData({ name: "", contact_info: "", image: "" });
      } else {
        alert("Not successful");
      }
    } catch (err) {
      console.error("Failed to add coach", err);
    }
  };

  const handleUpdateClick = (coach: Coaches) => {
    setIsUpdating(true);
    setSelectedCoaches(coach);
    setSelectedTeam(coach.team.name);
    setFormData({
      name: coach.name,
      contact_info: coach.contact_info,
      image: "",
    });
  };

  const handleUpdateCoach = async () => {
    if (!selectedCoaches || !selectedSport)
      return alert("Please select a sport and player");

    const formDataPayload = new FormData();
    formDataPayload.append("name", formData.name);
    formDataPayload.append("contact_info", formData.contact_info);
    if (formData.image) {
      formDataPayload.append("image", formData.image);
    }

    try {
      const res = await fetch(`/api/coaches/${selectedCoaches.id}`, {
        method: "PUT",
        body: formDataPayload,
      });
      const updatedPlayer = await res.json();
      setCoaches((prev) =>
        prev.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p))
      );
      setFormData({ name: "", contact_info: "", image: "" });
      setIsUpdating(false);
      setSelectedCoaches(null);
      setSelectedTeam("");
      alert("coach updated successfully");
    } catch (err) {
      console.error("Failed to update coach", err);
      alert("Failed to update coach");
    }
  };

  const handleFormSubmit = () => {
    if (isUpdating) {
      handleUpdateCoach();
    } else {
      handleAddCoaches();
    }
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setSelectedCoaches(null);
    setFormData({ name: "", contact_info: "", image: "" });
    setSelectedTeam("");
  };

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await fetch("/api/typeofsport");
        const data = await res.json();

        if (data && Array.isArray(data.typeOfSport)) {
          setSports(data.typeOfSport);
          console.log(data.typeOfSport);
        } else {
          console.error("Invalid response structure:", data);
          setSports([]);
        }
      } catch (err) {
        console.error("Failed to fetch sports", err);
        setSports([]);
      }
    };

    fetchSports();
  }, []);

  useEffect(() => {
    if (selectedSport) {
      console.log("Fetching team for sport id:", selectedSport);

      const fetchTeams = async () => {
        try {
          const res = await fetch(`/api/team/by-sport/${selectedSport}`);
          const data = await res.json();
          setTeams(data.data);
        } catch (err) {
          console.error("Failed to fetch teams", err);
        }
      };

      fetchTeams();
    }
  }, [selectedSport]);

  useEffect(() => {
    const fectCoaches = async () => {
      if (!selectedSport) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/coaches/by-sport/${selectedSport}`);
        const data = await res.json();
        setCoaches(data.coaches);
      } catch (err) {
        console.error("Failed to fetch coaches", err);
      } finally {
        setLoading(false);
      }
    };

    fectCoaches();
  }, [selectedSport]);

  const handleDeletecoach = async (id: string) => {
    if (confirm("Are you sour you want to delete this coach")) {
      try {
        await fetch(`/api/coaches/${id}`, {
          method: "DELETE",
        });
        setCoaches((prevCoaches) =>
          prevCoaches.filter((coach) => coach.id !== id)
        );
        alert("coach deleted successfully");
      } catch (err) {
        console.error("Failed to delete coach", err);
      }
    }
  };

  const filteredCoaches = (coaches ?? [])
    .filter((coach) => coach.name)
    .filter((coach) =>
      coach.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Pagination calculations
  const totalPages = Math.ceil(filteredCoaches.length / itemsPerPage);
  const paginatedCoaches = filteredCoaches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSport, selectedTeam, searchQuery]);

  return (
    <div className="px-8 py-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 capitalize">
        🧑‍🏫 Coaches in Ecap
      </h2>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
          >
            <option value="">🏅 Select a Sport</option>
            {sports.length > 0 ? (
              sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))
            ) : (
              <option disabled>No sports found</option>
            )}
          </select>

          <select
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">👥 Select a Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="🔍 Search by Name or Position"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
          />
        </div>

        {/* Add or Update Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <input
            name="name"
            type="text"
            placeholder="🧑 Coach Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
          />
          <input
            name="contact_info"
            type="text"
            placeholder="📞 Contact Info"
            value={formData.contact_info}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
          />
          <input
            name="image"
            type="file"
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
          />

          {/* Cancel button aligned right (optional) */}
          {isUpdating && (
            <div className="flex justify-end mb-4">
              <button
                onClick={handleCancelUpdate}
                className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleFormSubmit}
            className="bg-green-600 text-white px-8 py-2 rounded-[5px] hover:bg-green-700 transition"
          >
            {isUpdating ? "Update Coach" : "Add Coach"}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-gray-600 mb-6">Loading coaches...</p>
      )}

      {/* Table */}
      <div className="overflow-auto bg-white rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-full text-base text-left border-collapse border border-gray-300">
          <thead className="bg-blue-900 text-white text-lg text-center">
            <tr>
              <th className=" px-6 py-4">#</th>
              <th className=" px-6 py-4">Image</th>
              <th className=" px-6 py-4">Name</th>
              <th className=" px-6 py-4">Contact Info</th>
              <th className=" px-6 py-4">Team Name</th>
              <th className=" px-6 py-4">Division</th>
              <th className=" px-6 py-4">Team Contact</th>
              <th className=" px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCoaches.length > 0 ? (
              paginatedCoaches.map((coach, index) => (
                <tr
                  className="border border-gray-300 text-center hover:bg-gray-100"
                  key={coach.id}
                >
                  <td className=" px-6 py-4">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className=" px-6 py-4">
                    {coach.image ? (
                      <Image
                        src={coach.image}
                        alt="Coach Image"
                        width={48}
                        height={48}
                        className="rounded-full mx-auto"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td className=" px-6 py-4">{coach.name}</td>
                  <td className=" px-6 py-4">{coach.contact_info}</td>
                  <td className=" px-6 py-4">{coach.team.name}</td>
                  <td className=" px-6 py-4">{coach.team.division}</td>
                  <td className=" px-6 py-4">{coach.team.contact_info}</td>
                  <td className=" px-6 py-4">
                    <button
                      onClick={() => handleUpdateClick(coach)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeletecoach(coach.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center text-gray-600 p-6"
                >
                  No coaches found for this sport
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-400 hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border border-gray-400 hover:bg-gray-200 ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : ""
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-400 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
