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
  const [formData, setFormData] = useState({
    year: "",
    title: "",
    description: "",
  });
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
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      const res = await fetch(
        editId ? `/api/histories/${editId}` : "/api/histories",
        {
          method: editId ? "PUT" : "POST",
          body: form,
        }
      );
      console.log(form);

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
    <section className="px-8 py-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        📜 History Management
      </h2>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border">
        <h3 className="text-xl font-semibold mb-5 text-gray-800">
          ➕ Add or Update History
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <input
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
          />
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
          />
          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {editId ? "Update History" : "Add History"}
          </button>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <p className="text-gray-600 text-center">Loading histories...</p>
      ) : (
        <div className="overflow-auto bg-white rounded-2xl shadow-lg border border-gray-200">
          <table className="min-w-full text-base text-left">
            <thead className="bg-blue-900 text-white text-lg text-center">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Year</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {histories.length > 0 ? (
                histories.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50 transition duration-300 text-center text-lg"
                  >
                    <td className="px-4 py-3 border-t">{index + 1}</td>

                    <td className="border-t px-6 py-4">
                      <Image
                        src={item.imageUrl || "/placeholder.jpg"}
                        width={96}
                        height={96}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-xl border"
                      />

                    </td>

                    <td className="border-t px-6 py-4">{item.year}</td>
                    <td className="border-t px-6 py-4 text-left">
                      {item.title}
                    </td>
                    <td className="border-t px-6 py-4 text-left">
                      {item.description}
                    </td>
                    <td className="border-t px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow text-sm"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-gray-500 py-6 text-lg"
                  >
                    No history records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
