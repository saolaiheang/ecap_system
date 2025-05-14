"use client";

import { useEffect, useState, ChangeEvent } from "react";

interface Profile {
  id: number;
  name: string;
  location: string;
  start_date: string;
  sport_type_id: string;
  team_name:string;
}

export default function ProfileDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    start_date: "",
    sport_type_id: "",
    team_name:"",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        setProfiles(data);
      } catch (err) {
        console.error("Failed to fetch profiles", err);
      }
    };

    fetchProfiles();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    const { name, location, start_date, sport_type_id } = formData;
    if (!name || !location || !start_date || !sport_type_id) return;

    const payload = { name, location, start_date, sport_type_id };

    try {
      if (editingId !== null) {
        const res = await fetch(`/api/profile/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setProfiles((prev) =>
          prev.map((e) => (e.id === editingId ? updated : e))
        );
        setEditingId(null);
      } else {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        setProfiles((prev) => [...prev, created]);
      }

      setFormData({
        name: "",
        location: "",
        start_date: "",
        sport_type_id: "",
        team_name:"",
      });
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  };

  const handleEdit = (profile: Profile) => {
    setFormData({
      name: profile.name,
      location: profile.location,
      start_date: profile.start_date,
      sport_type_id: profile.sport_type_id,
      team_name: profile.team_name, 
    });
    setEditingId(profile.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/profile/${id}`, { method: "DELETE" });
      setProfiles((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete profile", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#1D276C] mb-4 capitalize">
        Profile Management
      </h2>

      {/* Form */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <input
          name="name"
          type="text"
          placeholder="Profile Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="location"
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="sport_type_id"
          type="text"
          placeholder="Sport Type ID"
          value={formData.sport_type_id}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAddOrUpdate}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Table */}
      <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Start Date</th>
            <th className="border px-4 py-2">Sport Type ID</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <td className="border px-4 py-2">{profile.id}</td>
              <td className="border px-4 py-2">{profile.name}</td>
              <td className="border px-4 py-2">{profile.location}</td>
              <td className="border px-4 py-2">{profile.start_date}</td>
              <td className="border px-4 py-2">{profile.sport_type_id}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(profile)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(profile.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
