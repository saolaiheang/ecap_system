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

interface Player {
  id: string;
  name: string;
  position: string;
  contact_info: string;
  image: string;
  team: {
    name: string;
    division: string;
    contact_info: string;
  };
}

export default function PlayerProfileBySport() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    contact_info: "",
    image: "" as string | File,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle input changes including file uploads
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Add new player
  const handleAddPlayer = async () => {
    if (!selectedSport) return alert("Please select a sport type");
    if (!selectedTeam) return alert("Please select a team");

    const formDataPayload = new FormData();
    formDataPayload.append("name", formData.name);
    formDataPayload.append("position", formData.position);
    formDataPayload.append("contact_info", formData.contact_info);
    formDataPayload.append("team_id", selectedTeam);
    formDataPayload.append("sport_id", selectedSport);
    if (formData.image instanceof File) {
      formDataPayload.append("image", formData.image);
    }

    try {
      const res = await fetch(`/api/player/by-team/${selectedTeam}`, {
        method: "POST",
        body: formDataPayload,
      });
      const newPlayer = await res.json();
      setPlayers((prev) => [...prev, newPlayer]);
      alert("Player added successfully");
      setFormData({ name: "", position: "", contact_info: "", image: "" });
    } catch (err) {
      console.error("Failed to add player", err);
    }
  };

  // Prepare to update player
  const handleUpdateClick = (player: Player) => {
    setIsUpdating(true);
    setSelectedPlayer(player);
    setSelectedTeam(player.team.name); // Note: This should ideally be team id, but you have name here — adjust as needed
    setFormData({
      name: player.name,
      position: player.position,
      contact_info: player.contact_info,
      image: "",
    });
  };

  // Update existing player
  const handleUpdatePlayer = async () => {
    if (!selectedPlayer || !selectedSport)
      return alert("Please select a sport and player");

    const formDataPayload = new FormData();
    formDataPayload.append("name", formData.name);
    formDataPayload.append("position", formData.position);
    formDataPayload.append("contact_info", formData.contact_info);
    if (formData.image instanceof File) {
      formDataPayload.append("image", formData.image);
    }

    try {
      const res = await fetch(`/api/player/${selectedPlayer.id}`, {
        method: "PUT",
        body: formDataPayload,
      });
      const updatedPlayer = await res.json();
      setPlayers((prev) =>
        prev.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p))
      );
      setFormData({ name: "", position: "", contact_info: "", image: "" });
      setIsUpdating(false);
      setSelectedPlayer(null);
      setSelectedTeam("");
      alert("Player updated successfully");
    } catch (err) {
      console.error("Failed to update player", err);
      alert("Failed to update player");
    }
  };

  // Submit handler for add/update
  const handleFormSubmit = () => {
    if (isUpdating) {
      handleUpdatePlayer();
    } else {
      handleAddPlayer();
    }
  };

  // Cancel update mode
  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setSelectedPlayer(null);
    setFormData({ name: "", position: "", contact_info: "", image: "" });
    setSelectedTeam("");
  };

  // Fetch sports on mount
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await fetch("/api/typeofsport");
        const data = await res.json();

        if (data && Array.isArray(data.typeOfSport)) {
          setSports(data.typeOfSport);
        } else {
          setSports([]);
        }
      } catch (err) {
        console.error("Failed to fetch sports", err);
        setSports([]);
      }
    };

    fetchSports();
  }, []);

  // Fetch teams when sport changes
  useEffect(() => {
    if (selectedSport) {
      const fetchTeams = async () => {
        try {
          const res = await fetch(`/api/team/by-sport/${selectedSport}`);
          const data = await res.json();
          setTeams(data.data);
        } catch (err) {
          console.error("Failed to fetch teams", err);
          setTeams([]);
        }
      };

      fetchTeams();
    } else {
      setTeams([]);
      setSelectedTeam("");
    }
    setCurrentPage(1); // Reset page when sport changes
  }, [selectedSport]);

  // Fetch players when sport changes
  useEffect(() => {
    if (!selectedSport) {
      setPlayers([]);
      return;
    }
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/player/by-sport/${selectedSport}`);
        const data = await res.json();
        setPlayers(data.data);
      } catch (err) {
        console.error("Failed to fetch players", err);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
    setCurrentPage(1); // Reset page when sport changes
  }, [selectedSport]);

  // Delete player
  const handleDeletePlayer = async (id: string) => {
    if (confirm("Are you sure you want to delete this player?")) {
      try {
        await fetch(`/api/player/${id}`, {
          method: "DELETE",
        });
        setPlayers((prevPlayers) =>
          prevPlayers.filter((player) => player.id !== id)
        );
        alert("Player deleted successfully");
      } catch (err) {
        console.error("Failed to delete player", err);
      }
    }
  };

  // Filter players by search query
  const filteredPlayers = players
    .filter((player) => player.name && player.position)
    .filter(
      (player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.position.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Pagination calculation
  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="px-8 py-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 capitalize">
        🧑‍💼 Player Profiles by Sport Type
      </h2>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border">
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <select
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full md:w-1/3"
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
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full md:w-1/3"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">👕 Select a Team</option>
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // reset page on search
            }}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
          />
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            name="name"
            type="text"
            placeholder="🧍 Player Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
          />
          <input
            name="position"
            type="text"
            placeholder="⚽ Position"
            value={formData.position}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
          />
          <input
            name="contact_info"
            type="text"
            placeholder="📞 Contact Info"
            value={formData.contact_info}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
          />
          <input
            name="image"
            type="file"
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          {isUpdating && (
            <button
              onClick={handleCancelUpdate}
              className="bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleFormSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-[5px] hover:bg-green-700 transition ml-auto"
          >
            {isUpdating ? "Update Player" : "Add Player"}
          </button>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <p className="text-center text-gray-600">Loading players...</p>
      )}

      {/* Table */}
      <div className="overflow-auto bg-white rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-full text-base text-left border-collapse border border-gray-300">
          <thead className="bg-blue-900 text-white text-lg text-center">
            <tr>
              <th className=" px-4 py-3">#</th>
              <th className=" px-4 py-3">Image</th>
              <th className=" px-4 py-3">Name</th>
              <th className=" px-4 py-3">Position</th>
              <th className=" px-4 py-3">Contact Info</th>
              <th className=" px-4 py-3">Team</th>
              <th className=" px-4 py-3">Division</th>
              <th className=" px-4 py-3">Team Contact</th>
              <th className=" px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPlayers.length > 0 ? (
              paginatedPlayers.map((player, index) => (
                <tr
                  key={player.id}
                  className="text-center hover:bg-blue-50 transition duration-300"
                >
                  <td className=" px-4 py-3 border-t">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className=" px-4 py-3 border-t">
                    <Image
                      src={player.image}
                      alt={player.name}
                      width={50}
                      height={50}
                      className="rounded-full mx-auto"
                    />
                  </td>
                  <td className=" px-4 py-3 border-t">{player.name}</td>
                  <td className=" px-4 py-3 border-t">{player.position}</td>
                  <td className=" px-4 py-3 border-t">{player.contact_info}</td>
                  <td className=" px-4 py-3 border-t">{player.team.name}</td>
                  <td className=" px-4 py-3 border-t">{player.team.division}</td>
                  <td className=" px-4 py-3 border-t">{player.team.contact_info}</td>
                  <td className=" px-4 py-3 border-t space-x-2">
                    <button
                      onClick={() => handleUpdateClick(player)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeletePlayer(player.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-6 text-gray-600 font-semibold"
                >
                  No players found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-400 hover:bg-gray-200 disabled:opacity-50`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
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
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-400 hover:bg-gray-200 disabled:opacity-50`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
