"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { Button } from "./button";
import Image from "next/image";

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
  sportType: SportType;
}

export default function FetchTeam() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [sportTypes, setSportTypes] = useState<SportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<{
    name: string;
    division: string;
    contact_info: string;
    sport_type_id: string;
    image: string | File;
  }>({
    name: "",
    division: "",
    contact_info: "",
    sport_type_id: "",
    image: "",
  });

  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchTeams();
    fetchSportTypes();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      setTeams(data.data || []);
    } catch {
      setError("Failed to fetch teams.");
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditTeam = (team: Team) => {
    setForm({
      name: team.name,
      division: team.division,
      contact_info: team.contact_info,
      sport_type_id: team.sportType.id,
      image: team.image,
    });
    setEditingTeamId(team.id);
  };

  const handleAddOrUpdateTeam = async () => {
    const { name, division, contact_info, sport_type_id, image } = form;

    if (!name || !division || !contact_info || !sport_type_id || !image) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("division", division);
    formData.append("contact_info", contact_info);
    formData.append("sport_id", sport_type_id);
    if (typeof image !== "string") {
      formData.append("image", image);
    }

    try {
      const res = await fetch(`/api/team${editingTeamId ? `/${editingTeamId}` : ""}`, {
        method: editingTeamId ? "PUT" : "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save team");

      await fetchTeams();
      alert(editingTeamId ? "Team updated successfully" : "Team added successfully");

      setForm({
        name: "",
        division: "",
        contact_info: "",
        sport_type_id: "",
        image: "",
      });
      setEditingTeamId(null);
    } catch (err) {
      console.error("Error saving team:", err);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeams = teams.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(teams.length / itemsPerPage);

  if (loading) return <p className="px-8 py-6">Loading teams...</p>;
  if (error) return <p className="px-8 py-6 text-red-500">{error}</p>;

  return (
    <div>
      <section className="px-8 py-6 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">🏆 Team Management</h2>

        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border">
          <h3 className="text-xl font-semibold mb-5 text-gray-800">➕ Add / Edit Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              name="name"
              placeholder="📝 Team Name"
              className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
              value={form.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="division"
              placeholder="🏅 Division"
              className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
              value={form.division}
              onChange={handleChange}
            />
            <input
              type="text"
              name="contact_info"
              placeholder="📞 Contact Info"
              className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
              value={form.contact_info}
              onChange={handleChange}
            />
            <select
              name="sport_type_id"
              className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
              value={form.sport_type_id}
              onChange={handleChange}
            >
              <option value="">🏀 Select Sport Type</option>
              {sportTypes.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
              onChange={handleChange}
            />
          </div>
          <div className="mt-6 text-right">
            <Button
              onClick={handleAddOrUpdateTeam}
              className="bg-green-600 text-white px-6 py-2 rounded-[5px] hover:bg-green-700 transition"
            >
              {editingTeamId ? "Update Team" : "Add Team"}
            </Button>
          </div>
        </div>

        {/* Team Table */}
        <h3 className="text-xl font-semibold px-6 pt-6 mb-4 text-gray-800">📋 Teams List</h3>

        <div className="overflow-auto bg-white rounded-2xl shadow-lg border border-gray-200">
          <table className="min-w-full text-base text-left">
            <thead className="bg-blue-900 text-white text-lg text-center">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Team Name</th>
                <th className="px-6 py-4">Division</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Sport Type</th>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTeams.map((team, index) => (
                <tr
                  key={team.id}
                  className="hover:bg-blue-50 transition duration-300 text-center"
                >
                  <td className="px-6 py-4 border-t">{indexOfFirstItem + index + 1}</td>
                  <td className="px-6 py-4 border-t">{team.name}</td>
                  <td className="px-6 py-4 border-t">{team.division}</td>
                  <td className="px-6 py-4 border-t">{team.contact_info}</td>
                  <td className="px-6 py-4 border-t">{team.sportType?.name}</td>
                  <td className="px-6 py-4 border-t">
                    {team.image ? (
                      <Image
                        src={team.image}
                        width={90}
                        height={90}
                        alt={team.name}
                        className="object-cover rounded-lg mx-auto"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td className="px-6 py-4 border-t">
                    <Button
                      onClick={() => handleEditTeam(team)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow"
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 gap-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Next
          </Button>
        </div>
      </section>
    </div>
  );
}
