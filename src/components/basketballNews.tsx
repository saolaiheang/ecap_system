"use client";

import { useState, ChangeEvent } from "react";

interface News {
  id: number;
  title: string;
  description: string;
  image: string; // image URL
}

export default function BasketballNews() {
  const [newsList, setNewsList] = useState<News[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddNews = () => {
    const { title, description } = formData;
    if (!title || !description) return;

    const newNews: News = {
      id: newsList.length + 1,
      ...formData,
    };

    setNewsList([...newsList, newNews]);
    setFormData({ title: "", description: "", image: "" });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#1D276C]">Basketball News</h2>

      {/* Add News Form */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="p-2 border rounded col-span-1"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="p-2 border rounded col-span-1"
          rows={1}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="p-2 border rounded col-span-1"
        />
        <div className="col-span-3">
          <button
            onClick={handleAddNews}
            className="bg-blue-600 text-white rounded px-6 py-2 hover:bg-blue-700"
          >
            Add News
          </button>
        </div>
      </div>

      {/* News List Table */}
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
          {newsList.map((news) => (
            <tr key={news.id}>
              <td className="border px-4 py-2">{news.id}</td>
              <td className="border px-4 py-2">{news.title}</td>
              <td className="border px-4 py-2">{news.description}</td>
              <td className="border px-4 py-2">
                {news.image ? (
                  <img src={news.image} alt="News" className="w-16 h-16 object-cover mx-auto" />
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
