
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
interface Props {
  sport: string;
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


export default function PlayerProfileBySport({ sport }: Props){
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
    image: ""
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleAddPlayer = async () => {
    if (!selectedSport) return alert("Please select a sport type");
    const formDataPayload = new FormData();
    formDataPayload.append("name", formData.name);
    formDataPayload.append("position", formData.position);
    formDataPayload.append("contact_info", formData.contact_info);
    formDataPayload.append("team_id", selectedTeam);
    formDataPayload.append("sport_id", selectedSport);
    formDataPayload.append("image", formData.image);
    try {
      const res = await fetch(`/api/player/by-team/${selectedTeam}`, {
        method: "POST",
        body: formDataPayload
      })
      const newPlayer = await res.json();
      setPlayers((prev) => [...prev, newPlayer]);
      alert("Player added successfully");
      setFormData({ name: "", position: "", contact_info: "", image: "" });
    } catch (err) {
      console.error("Failed to add player", err);
    }
  }

  const handleUpdateClick = (player: Player) => {
    setIsUpdating(true);
    setSelectedPlayer(player);
    setSelectedTeam(player.team.name);
    setFormData({
      name: player.name,
      position: player.position,
      contact_info: player.contact_info,
      image: ""
    });
  };

  const handleUpdatePlayer = async () => {
    if (!selectedPlayer || !selectedSport) return alert("Please select a sport and player");

    const formDataPayload = new FormData();
    formDataPayload.append("name", formData.name);
    formDataPayload.append("position", formData.position);
    formDataPayload.append("contact_info", formData.contact_info);
    if (formData.image) {
      formDataPayload.append("image", formData.image);
    }


    try {
      const res = await fetch(`/api/player/${selectedPlayer.id}`, {
        method: "PUT",
        body: formDataPayload
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

  const handleFormSubmit = () => {
    if (isUpdating) {
      handleUpdatePlayer();
    } else {
      handleAddPlayer();
    }
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setSelectedPlayer(null);
    setFormData({ name: "", position: "", contact_info: "", image: "" });
    setSelectedTeam("");
  };




  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await fetch("/api/typeofsport");
        const data = await res.json();

        if (data && Array.isArray(data.typeOfSport)) {
          setSports(data.typeOfSport);
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
    const fetchPlayers = async () => {
      if (!selectedSport) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/player/by-sport/${selectedSport}`);
        const data = await res.json();
        setPlayers(data.data);
      } catch (err) {
        console.error("Failed to fetch players", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [selectedSport]);

  useEffect(() => {
    if (sport) {
      setSelectedSport(sport);
    }
  }, [sport]);

  const handleDeletePlayer = async (id: string) => {
    if (confirm("Are you sour you want to delete this player")) {
      try {
        await fetch(`/api/player/${id}`, {
          method: "DELETE",
        });
        setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== id));
        alert("Player deleted successfully");
      } catch (err) {
        console.error("Failed to delete player", err);
      }

    }


  }
  const filteredPlayers = players
    .filter((player) => player.name && player.position)
    .filter((player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position.toLowerCase().includes(searchQuery.toLowerCase())
    );
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#1D276C] mb-4 capitalize">
        Player Profiles by Sport Type
      </h2>
      <div className="mb-4 flex gap-4">
        <select
          className="border p-2 rounded w-1/3"
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
        >
          <option value="">Select a Sport</option>
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
          className="border p-2 rounded w-1/3"
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          <option value="">Select a Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Name or Position"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-2/3"
        />
      </div>


      <div className="grid grid-cols-4 gap-4 mb-6">
        <input
          name="name"
          type="text"
          placeholder="Player Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="position"
          type="text"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="contact_info"
          type="text"
          placeholder="Contact Info"
          value={formData.contact_info}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="image"
          type="file"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <div className="flex gap-2">
          <button
            onClick={handleFormSubmit}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
          >
            {isUpdating ? "Update Player" : "Add Player"}
          </button>
          {isUpdating && (
            <button
              onClick={handleCancelUpdate}
              className="bg-gray-600 text-white rounded px-4 py-2 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && <p>Loading players...</p>}

      {/* Player Table */}
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Position</th>
            <th className="border px-4 py-2">Contact Info</th>
            <th className="border px-4 py-2">Team Name</th>
            <th className="border px-4 py-2">Division</th>
            <th className="border px-4 py-2">Team Contact</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player, index) => (
              <tr key={player.id} >
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  <Image
                    src={player.image}
                    alt={player.name}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                </td>
                <td className="border px-4 py-2">{player.name}</td>
                <td className="border px-4 py-2">{player.position}</td>
                <td className="border px-4 py-2">{player.contact_info}</td>
                <td className="border px-4 py-2">{player.team.name}</td>
                <td className="border px-4 py-2">{player.team.division}</td>
                <td className="border px-4 py-2">{player.team.contact_info}</td>
                <td>
                  <button
                    onClick={() => handleDeletePlayer(player.id)}
                    className="bg-red-500 text-white px-2 py-1 ml-4 text-center rounded hover:bg-red-600 "
                    disabled={loading}
                  >
                    Delete
                  </button>

                  <button onClick={() => handleUpdateClick(player)} className="bg-yellow-500 text-white ml-4 px-2 py-1 rounded hover:bg-yellow-600">
                    Update
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center p-4 text-gray-500">
                No players found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

