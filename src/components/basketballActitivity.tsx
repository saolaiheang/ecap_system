"use client";

import { useState, ChangeEvent } from "react";

interface Activity {
  id: number;
  title: string;
  description: string;
  image: string; // base64 or URL for preview
}

export default function BasketballActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddActivity = () => {
    const { title, description } = formData;
    if (!title || !description) return;

    const newActivity: Activity = {
      id: activities.length + 1,
      ...formData,
    };

    setActivities([...activities, newActivity]);
    setFormData({ title: "", description: "", image: "" });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#1D276C]">Basketball Activity</h2>

      {/* Add Activity Form */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="p-2 border rounded"
        />
        <div className="col-span-3">
          <button
            onClick={handleAddActivity}
            className="bg-blue-600 text-white rounded px-6 py-2 hover:bg-blue-700"
          >
            Add Activity
          </button>
        </div>
      </div>

      {/* Activity Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Image</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td className="border px-4 py-2">{activity.id}</td>
              <td className="border px-4 py-2">{activity.title}</td>
              <td className="border px-4 py-2">{activity.description}</td>
              <td className="border px-4 py-2">
                {activity.image ? (
                  <img src={activity.image} alt="Activity" className="w-16 h-16 object-cover mx-auto" />
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
