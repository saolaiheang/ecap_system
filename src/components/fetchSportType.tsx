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

  // 🟨 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    setIsUpdating(true);
    try {
      const res = await fetch("/api/typeofsport", {
        method: "POST",
        body: formDataPayload,
      });
      await res.json();
      setFormData({ name: "", description: "", image: "" });
      setIsCreating(false);
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

  const closeModals = () => {
    setFormData({ name: "", description: "", image: "" });
    setIsCreating(false);
    setEditingSportId(null);
  };

  // 🔵 Pagination logic
  const totalPages = sports ? Math.ceil(sports.length / pageSize) : 0;
  const paginatedSports = sports
    ? sports.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  return (
    <div className="px-8 py-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">📰 Types Of Sport</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition"
        >
          Add New Sport
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : sports && sports.length > 0 ? (
        <>
          <div className="overflow-auto bg-white rounded-2xl shadow-lg">
            <table className="min-w-full text-base text-left">
              <thead className="bg-blue-900 text-white text-lg text-center">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSports.map((item, index) => (
                  <tr key={item.id} className="text-center hover:bg-blue-50 transition duration-300">
                    <td className="px-6 py-4 border-t">{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className="px-6 py-4 border-t">
                      <Image
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4 border-t">{item.name}</td>
                    <td className="px-6 py-4 border-t">{item.description || "No description"}</td>
                    <td className="px-6 py-4 border-t">
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow text-sm"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔵 Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <p>No sports data found.</p>
      )}

      {/* 🔽 Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-center">Add New Sport</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 border rounded"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex justify-between">
              <button
                onClick={handleCreate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={isUpdating}
              >
                {isUpdating ? "Creating..." : "Create"}
              </button>
              <button
                onClick={closeModals}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔽 Edit Modal */}
      {editingSportId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-center">Edit Sport</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 border rounded"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex justify-between">
              <button
                onClick={() => handleUpdate(editingSportId)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
              <button
                onClick={closeModals}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
