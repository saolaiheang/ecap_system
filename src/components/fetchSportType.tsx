"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";

interface Sport {
  id: string;
  name: string;
  description?: string;
  image: string;
}

interface FormDataState {
  name: string;
  description: string;
  image: File | string;
}

export default function SportComponent() {
  const [sports, setSports] = useState<Sport[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    description: "",
    image: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  const [editingSportId, setEditingSportId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchSports = async () => {
    try {
      const response = await fetch("/api/typeofsport");
      const data = await response.json();
      setSports(Array.isArray(data?.typeOfSport) ? data.typeOfSport : []);
    } catch (error) {
      console.error("Failed to fetch sports:", error);
      setSports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCreate = async () => {
    const formDataPayload = new FormData();
    formDataPayload.append("name", formData.name);
    formDataPayload.append("description", formData.description);
    if (formData.image && typeof formData.image !== "string") {
      formDataPayload.append("image", formData.image);
    }

    setIsUpdating(true); // reuse updating state

    try {
      const res = await fetch("/api/typeofsport", {
        method: "POST",
        body: formDataPayload,
      });
      await res.json();
      setFormData({ name: "", description: "", image: "" });
      setIsCreating(false);

      // ✅ Refresh list
      await fetchSports();

      alert("Sport created successfully!");
    } catch (error) {
      console.error("Failed to create sport:", error);
      alert("Failed to create sport. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdate = async (id: string) => {
    const formDataPayload = new FormData();
    formDataPayload.append("name", formData.name);
    formDataPayload.append("description", formData.description);
    if (formData.image && typeof formData.image !== "string") {
      formDataPayload.append("image", formData.image);
    }

    setIsUpdating(true);

    try {
      const res = await fetch(`/api/typeofsport/${id}`, {
        method: "PUT",
        body: formDataPayload,
      });
      await res.json();
      setFormData({ name: "", description: "", image: "" });
      setEditingSportId(null);
      await fetchSports();

      alert("Sport updated successfully!");
    } catch (error) {
      console.error("Failed to update sport:", error);
      alert("Failed to update sport. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditModal = (sport: Sport) => {
    setFormData({
      name: sport.name,
      description: sport.description || "",
      image: sport.image,
    });
    setEditingSportId(sport.id);
  };

  const closeEditModal = () => {
    setFormData({ name: "", description: "", image: "" });
    setEditingSportId(null);
  };

  return (
    <div className="px-8 py-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          📰 Types Of Sport
        </h2>

        <button
          onClick={() => setIsCreating(true)}
          className="mb-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition"
        >
          Add New Sport
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : sports && sports.length > 0 ? (
        <div className="overflow-auto bg-white rounded-2xl shadow-lg ">
          <table className="min-w-full text-base text-left ">
            <thead className="bg-blue-900 text-white text-lg text-center">
              <tr>
                <th className=" px-6 py-4">No</th>
                <th className=" px-6 py-4">Image</th>
                <th className=" px-6 py-4">Name</th>
                <th className=" px-6 py-4">Description</th>
                <th className=" px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sports.map((item, index) => (
                <tr
                  key={item.id}
                  className="text-center hover:bg-blue-50 transition duration-300"
                >
                  <td className=" px-6 py-4">{index + 1}</td>
                  <td className=" px-6 py-4">
                    <div className="flex justify-center items-center">
                      <Image
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </td>
                  <td className=" px-6 py-4">{item.name}</td>
                  <td className=" px-6 py-4">
                    {item.description || "No description"}
                  </td>
                  <td className=" px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow text-sm"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No sports data found.</p>
      )}

      {/* Create Sport Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-6">Create New Sport</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-1  -gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full mt-1  -gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border"
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium">
                  Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full mt-1  -gray-300 rounded-md p-2 border"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setFormData({ name: "", description: "", image: "" });
                }}
                disabled={isUpdating}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md border"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                {isUpdating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sport Modal */}
      {editingSportId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-6">Edit Sport</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium">
                  Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2"
                />
                {typeof formData.image === "string" && (
                  <Image
                    src={formData.image}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="mt-2 rounded"
                  />
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeEditModal}
                disabled={isUpdating}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdate(editingSportId)}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                {isUpdating ? "Updating..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
