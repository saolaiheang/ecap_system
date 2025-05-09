


"use client";

import { useState, ChangeEvent } from "react";

interface Profile {
  id: number;
  name: string;
  age: string;
  team: string;
  image: string; // Image URL
}

export default function HockeyProfile() {
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: 1,
      name: "John Doe",
      age: "35",
      team: "Team Alpha",
      image: "/default-profile.png", // You can replace with any default
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    team: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddProfile = () => {
    if (!formData.name || !formData.age || !formData.team || !imagePreview) return;

    const newProfile: Profile = {
      id: profiles.length + 1,
      name: formData.name,
      age: formData.age,
      team: formData.team,
      image: imagePreview,
    };

    setProfiles([...profiles, newProfile]);
    setFormData({ name: "", age: "", team: "" });
    setImageFile(null);
    setImagePreview("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#1D276C]">Coach & Player Profiles</h2>

      {/* Add Profile Form */}
      <div className="grid grid-cols-5 gap-4 mb-6 items-center">
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
          name="team"
          placeholder="Team"
          value={formData.team}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="p-2"
        />
        <button
          onClick={handleAddProfile}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Add Profile
        </button>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
          <img
            src={imagePreview}
            alt="Preview"
            className="w-24 h-24 object-cover rounded border"
          />
        </div>
      )}

      {/* Profile Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Age</th>
            <th className="border px-4 py-2">Team</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <td className="border px-4 py-2">{profile.id}</td>
              <td className="border px-4 py-2">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>
              <td className="border px-4 py-2">{profile.name}</td>
              <td className="border px-4 py-2">{profile.age}</td>
              <td className="border px-4 py-2">{profile.team}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
