"use client";

import { useState, ChangeEvent } from "react";

interface Profile {
  id: number;
  name: string;
  age: number;
  sport: string;
  image: string;
}
interface Props {
  sport: string;
}

export default function NewsDeshboard({ sport }: Props) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sport: "",
    image: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = () => {
    const { name, age, sport, image } = formData;
    if (!name || !age || !sport) return;

    if (editingId !== null) {
      setProfiles(
        profiles.map((profile) =>
          profile.id === editingId
            ? { ...profile, name, age: Number(age), sport, image }
            : profile
        )
      );
      setEditingId(null);
    } else {
      const newProfile: Profile = {
        id: profiles.length + 1,
        name,
        age: Number(age),
        sport,
        image,
      };
      setProfiles([...profiles, newProfile]);
    }

    setFormData({ name: "", age: "", sport: "", image: "" });
  };

  const handleEdit = (id: number) => {
    const profile = profiles.find((p) => p.id === id);
    if (profile) {
      setFormData({
        name: profile.name,
        age: String(profile.age),
        sport: profile.sport,
        image: profile.image,
      });
      setEditingId(id);
    }
  };

  const handleDelete = (id: number) => {
    setProfiles(profiles.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#1D276C]">
        Profile Dashboard
      </h2>

      {/* Form Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="sport"
          placeholder="Sport"
          value={formData.sport}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <div className="col-span-2 md:col-span-4">
          <button
            onClick={handleAddOrUpdate}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {editingId !== null ? "Update Profile" : "Add Profile"}
          </button>
        </div>
      </div>

      {/* Profile Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Age</th>
            <th className="border px-4 py-2">Sport</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <td className="border px-4 py-2">{profile.id}</td>
              <td className="border px-4 py-2">{profile.name}</td>
              <td className="border px-4 py-2">{profile.age}</td>
              <td className="border px-4 py-2">{profile.sport}</td>
              <td className="border px-4 py-2">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt="Profile"
                    className="w-12 h-12 object-cover mx-auto rounded"
                  />
                ) : (
                  "-"
                )}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(profile.id)}
                  className="text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(profile.id)}
                  className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
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
