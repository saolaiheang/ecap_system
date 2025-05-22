"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { Button } from "./button";

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

  // Fetch teams
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

  // Fetch sport types
  const fetchSportTypes = async () => {
    try {
      const res = await fetch("/api/typeofsport");
      const data = await res.json();
      setSportTypes(data.typeOfSport || []);
    } catch {
      console.error("Failed to fetch sport types.");
    }
  };

  // Input change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form to add team
  const handleAddTeam = async () => {
    const { name, division, contact_info, sport_type_id, image } = form;

    if (!name || !division || !contact_info || !sport_type_id || !image) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append("name", name);
    formDataPayload.append("division", division);
    formDataPayload.append("contact_info", contact_info);
    formDataPayload.append("sport_id", sport_type_id);
    formDataPayload.append("image", image);

    try {
      const res = await fetch(`/api/team`, {
        method: "POST",
        body: formDataPayload,
      });

      if (!res.ok) throw new Error("Failed to add team");

      // Refresh the team list
      await fetchTeams();

      alert("Team added successfully");
      setForm({
        name: "",
        division: "",
        contact_info: "",
        sport_type_id: "",
        image: "",
      });
    } catch (err) {
      console.error("Failed to add team", err);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchSportTypes();
  }, []);

  if (loading) return <p className="px-8 py-6">Loading teams...</p>;
  if (error) return <p className="px-8 py-6 text-red-500">{error}</p>;

  return (
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
        <Button onClick={handleAddTeam}>Add Team</Button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Teams List</h3>
        <ul className="space-y-2">
          {teams.map((team) => (
            <li key={team.id} className="border p-3 rounded bg-white">
              <p>
                <strong>{team.name}</strong> - {team.division}
              </p>
              <p>Contact: {team.contact_info}</p>
              <p>Sport Type: {team.sportType?.name}</p>
              <img
                src={team.image}
                alt={team.name}
                className="w-20 h-20 object-cover mt-2 rounded"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
