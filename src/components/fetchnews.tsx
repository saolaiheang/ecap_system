"use client";

import { useEffect, useState, ChangeEvent } from "react";

interface Sport {
  id: string;
  name: string;
}

interface News {
  id: string;
  title: string;
  description: string;
  image: string;
  sport_type?: {
    id: string;
    name: string;
    description:string;
    image:string;
  };
}

export default function FetchNews({ sport }: { sport: string }) {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editNewsId, setEditNewsId] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const fetchNews = async (sportId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news/by-sport/${sportId}`);
      const data = await res.json();
      setNewsList(data.data);
    } catch (err) {
      console.error("Failed to fetch news", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateNews = async () => {
    if (!selectedSport) {
      alert("Please select a sport before submitting.");
      return;
    }

    if (!formData.title || !formData.description) {
      alert("Please fill out both the title and description.");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("sport_type_id", selectedSport);
    if (imageFile) form.append("image", imageFile);

    try {
      const response = await fetch(
        editNewsId ? `/api/news/${editNewsId}` : "/api/news",
        {
          method: editNewsId ? "PUT" : "POST",
          body: form,
        }
      );

      if (!response.ok) throw new Error("Failed to submit news");

      alert(editNewsId ? "News updated successfully" : "News added successfully");

      setFormData({ title: "", description: "" });
      setImageFile(null);
      setEditNewsId(null);
      await fetchNews(selectedSport); // refresh data after add/update
    } catch (error) {
      console.error("Failed to submit news:", error);
      alert("Failed to submit news");
    }
  };

  const handleEdit = (news: News) => {
    setEditNewsId(news.id);
    setFormData({ title: news.title, description: news.description });
    setSelectedSport(news.sport_type?.id || "");
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news?")) return;

    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      alert("News deleted");
      await fetchNews(selectedSport); // refresh after delete
    } catch (error) {
      console.error("Failed to delete news:", error);
      alert("Failed to delete news");
    }
  };

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await fetch("/api/typeofsport");
        const data = await res.json();
        setSports(data.typeOfSport);
      } catch (err) {
        console.error("Failed to fetch sports", err);
      }
    };

    fetchSports();
  }, []);

  useEffect(() => {
    if (selectedSport) {
      fetchNews(selectedSport);
    } else {
      setNewsList([]);
    }
  }, [selectedSport]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#1D276C] mb-4">
        News Management
      </h2>

      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded w-1/3"
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
        >
          <option value="">Select a Sport</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSport && (
        <p className="mb-4 text-green-700 font-medium">
          Adding news for: {sports.find((s) => s.id === selectedSport)?.name}
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <input
          name="title"
          type="text"
          placeholder="News Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="News Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAddOrUpdateNews}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition col-span-3"
        >
          {editNewsId ? "Update News" : "Add News"}
        </button>
      </div>

      {loading ? (
        <p>Loading news...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Sport</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsList.length > 0 ? (
              newsList.map((news, index) => (
                <tr key={news.id ?? `${news.title}-${index}`}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="border px-4 py-2">{news.title}</td>
                  <td className="border px-4 py-2">{news.description}</td>
                  <td className="border px-4 py-2">
                    {news.sport_type?.name || "Unknown"}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(news)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(news.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No news available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
