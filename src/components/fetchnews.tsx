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
  };
}

export default function FetchNews({ sport }: { sport: string }) {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddNews = async () => {
    if (!selectedSport) return alert("Please select a sport");
    if (!imageFile) return alert("Please upload an image");

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("sport_type_id", selectedSport);
    form.append("image", imageFile);

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        body: form,
      });

      const newNews = await response.json();
      setNewsList((prev) => [...prev, newNews]);
      alert("News added successfully");

      setFormData({ title: "", description: "" });
      setImageFile(null);
    } catch (error) {
      console.error("Failed to add news:", error);
      alert("Failed to add news");
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
    const fetchNews = async () => {
      if (!selectedSport) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/news`);
        const data = await res.json();
        setNewsList(data.data);
      } catch (err) {
        console.error("Failed to fetch news", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedSport]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#1D276C] mb-4">News Management</h2>
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
          onClick={handleAddNews}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition col-span-3"
        >
          Add News
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
            </tr>
          </thead>
          <tbody>
            {newsList.length > 0 ? (
              newsList.map((news, index) => (
                <tr key={news.id}>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
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
