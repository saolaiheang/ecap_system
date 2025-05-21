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
  sport_type_id?: string;
  sportType?: {
    id: string;
    name: string;
    description: string;
    image: string | null;
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

      alert(
        editNewsId ? "News updated successfully" : "News added successfully"
      );

      setFormData({ title: "", description: "" });
      setImageFile(null);
      setEditNewsId(null);
      await fetchNews(selectedSport);
    } catch (error) {
      console.error("Failed to submit news:", error);
      alert("Failed to submit news");
    }
  };

  const handleEdit = (news: News) => {
    setEditNewsId(news.id);
    setFormData({ title: news.title, description: news.description });
    setSelectedSport(news.sportType?.id || "");
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
      await fetchNews(selectedSport);
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1D276C] mb-6 md:text-left">
        News Management
      </h2>

      <div className="mb-6">
        <select
          className="border border-gray-300 p-2 rounded-md"
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <input
          name="title"
          type="text"
          placeholder="News Title"
          value={formData.title}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md w-full"
        />

        <input
          name="description"
          type="text"
          placeholder="News Description"
          value={formData.description}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md w-full"
        />

        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded-md w-full"
        />

        <button
          onClick={handleAddOrUpdateNews}
          className=" bg-[#1D276C] hover:bg-[#152057] text-white font-semibold px-4 py-3 rounded-md transition w-full md:col-span-3"
        >
          {editNewsId ? "Update News" : "Add News"}
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading news...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-center">#</th>
                <th className="border px-4 py-2 text-center">Image</th>
                <th className="border px-4 py-2 text-center">Title</th>
                <th className="border px-4 py-2 text-center">Description</th>
                <th className="border px-4 py-2 text-center">Sport</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsList.length > 0 ? (
                newsList.map((news, index) => (
                  <tr key={news.id}>
                    <td className="border px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex justify-center items-center">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {news.title}
                    </td>
                    <td className="border px-4 py-2">{news.description}</td>
                    <td className="border px-4 py-2 text-center">
                      {news.sportType?.name}
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handleDelete(news.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEdit(news)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No news available.
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
