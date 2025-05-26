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


  if (loading) return <p className="px-8 py-6">Loading teams...</p>;
  if (error) return <p className="px-8 py-6 text-red-500">{error}</p>;

  return (
    <div>
      <section className="px-8 py-6">
        <h2 className="text-2xl font-bold text-[#1D276C] mb-4">Team Management</h2>

        <div className="bg-gray-100 p-4 rounded mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Team Name"
              className="p-2 border rounded"
              value={form.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="division"
              placeholder="Division"
              className="p-2 border rounded"
              value={form.division}
              onChange={handleChange}
            />
            <input
              type="text"
              name="contact_info"
              placeholder="Contact Info"
              className="p-2 border rounded"
              value={form.contact_info}
              onChange={handleChange}
            />
            <select
              name="sport_type_id"
              className="p-2 border rounded"
              value={form.sport_type_id}
              onChange={handleChange}
            >
              <option value="">Select Sport Type</option>
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
              className="p-2 border rounded"
              onChange={handleChange}
            />
          </div>
          <Button onClick={handleAddOrUpdateTeam}>
            {editingTeamId ? "Update Team" : "Add Team"}
          </Button>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Teams List</h3>
          <div className="overflow-auto">
            <table className="min-w-full border text-sm text-left bg-white">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Team Name</th>
                  <th className="p-2 border">Division</th>
                  <th className="p-2 border">Contact Info</th>
                  <th className="p-2 border">Sport Type</th>
                  <th className="p-2 border">Image</th>
                  <th className="p-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <td className="p-2 border text-center">{index + 1}</td>
                    <td className="p-2 border">{team.name}</td>
                    <td className="p-2 border">{team.division}</td>
                    <td className="p-2 border">{team.contact_info}</td>
                    <td className="p-2 border">{team.sportType?.name}</td>
                    <td className="p-2 border text-center">
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
                    <td className="p-2 border space-x-2 text-center">
                      <Button onClick={() => handleEditTeam(team)}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
