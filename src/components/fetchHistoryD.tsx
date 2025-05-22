"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
interface History {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function FetchHistories() {
  const [histories, setHistories] = useState<History[]>([]);
  const [formData, setFormData] = useState({ year: "", title: "", description: "" });
  const [imageUrl, setImageFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHistories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/histories");
      const data = await res.json();
      console.log("Fetched histories:", data); // DEBUG LOG
      setHistories(data.data || data.histories || []);
    } catch (err) {
      console.error("Failed to fetch histories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  // ✅ Handle input text changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle file input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  // ✅ Submit (create or update)
  const handleSubmit = async () => {
    if (!formData.title || !formData.year || !formData.description) {
      alert("Please fill out all fields");
      return;
    }

    const form = new FormData();
    form.append("year", formData.year);
    form.append("title", formData.title);
    form.append("description", formData.description);
    if (imageUrl) {
      form.append("imageUrl", imageUrl); // ✅ required for backend
    } else {
      alert("Please upload an image");
      return;
    }
    try {
      const res = await fetch(editId ? `/api/histories/${editId}` : "/api/histories", {
        method: editId ? "PUT" : "POST",
        body: form,
      });
      console.log(form)

    
      const responseText = await res.text(); // 👈 get the server's response body
    
      console.log("Server response:", responseText); // 👈 log the full text
    
      if (!res.ok) {
        console.error("Failed to submit. Server responded with:", responseText);
        throw new Error("Failed to submit");
      }
    
      alert(editId ? "Updated successfully" : "Created successfully");
      setFormData({ title: "", year: "", description: "" });
      setImageFile(null);
      setEditId(null);
      fetchHistories();
    } catch (err) {
      console.error("Error submitting:", err);
      alert("Error occurred");
    }
    
  };

  // ✅ Edit handler
  const handleEdit = (history: History) => {
    setEditId(history.id);
    setFormData({
      title: history.title,
      year: history.year,
      description: history.description,
    });
    setImageFile(null);
  };

  // ✅ Delete handler
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this history?")) return;

    try {
      const res = await fetch(`/api/histories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");
      alert("Deleted");
      fetchHistories();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#1D276C]">History Management</h2>

      {/* Form Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          className="border p-2 rounded-md"
        />
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 rounded-md"
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded-md"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded-md"
        />
        <button
          onClick={handleSubmit}
          className="bg-[#1D276C] text-white font-bold py-2 rounded-md md:col-span-4 hover:bg-[#152057]"
        >
          {editId ? "Update History" : "Add History"}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading histories...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">#</th>
                <th className="border p-2">Image</th>
                <th className="border p-2">Year</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {histories.length > 0 ? (
                histories.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="border p-2 text-center">{idx + 1}</td>
                    <td className="border p-2 text-center">
                      <Image
                        src={item.imageUrl || "/placeholder.jpg"}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="border p-2 text-center">{item.year}</td>
                    <td className="border p-2">{item.title}</td>
                    <td className="border p-2">{item.description}</td>
                    <td className="border p-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 p-4">
                    No history records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
