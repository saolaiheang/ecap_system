"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

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
      setNewsList(data.data || []);
      setCurrentPage(1); // Reset to page 1 when new data is fetched
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

  useEffect(() => {
    if (sport) {
      setSelectedSport(sport);
    }
  }, [sport]);

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
        setSports(data.typeOfSport || []);
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

  const totalPages = Math.ceil(newsList.length / itemsPerPage);
  const paginatedNews = newsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="px-8 py-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        📰 News Management
      </h2>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border flex flex-col">
        <h3 className="text-xl font-semibold mb-5 text-gray-800">
          ➕ Add News
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <input
            name="title"
            type="text"
            placeholder="📝 News Title"
            value={formData.title}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
          />
          <input
            name="description"
            type="text"
            placeholder="📝 News Description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
          />
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
          />
          <select
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-300 w-full md:w-auto"
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
          >
            <option value="">🏅 Select a Sport</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-auto text-right">
          <button
            onClick={handleAddOrUpdateNews}
            className="bg-green-600 text-white px-6 py-2 rounded-[5px] hover:bg-green-700 transition"
          >
            {editNewsId ? "Update News" : "Add News"}
          </button>
        </div>
      </div>


      {loading ? (
        
        <p className="text-center text-gray-600">Please select sport</p>
      ) : (
        <div className="overflow-auto bg-white rounded-2xl shadow-lg border border-gray-200">
          <table className="min-w-full text-base text-left border-collapse border border-gray-300">
            <thead className="bg-blue-900 text-white text-lg text-center">
              <tr>
                <th className=" px-6 py-4">No</th>
                <th className=" px-6 py-4">Image</th>
                <th className=" px-6 py-4">Title</th>
                <th className=" px-6 py-4">Description</th>
                <th className=" px-6 py-4">Sport</th>
                <th className=" px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedNews.length > 0 ? (
                paginatedNews.map((news, index) => (
                  <tr
                    key={news.id}
                    className="text-center hover:bg-blue-50 transition duration-300"
                  >


                    <td className=" px-6 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className=" px-6 py-4">
                      <div className="flex justify-center items-center">
                        <Image
                          src={news?.image || "/placeholder.jpg"}
                          alt={news?.title || "News Image"}
                          width={120}
                          height={120}
                          className="object-cover rounded-lg"
                        />
                      </div>
                    </td>
                    <td className=" px-6 py-4 border-t">{news.title}</td>
                    <td className=" px-6 py-4 border-t">{news.description}</td>
                    <td className=" px-6 py-4 border-t">{news.sportType?.name}</td>
                    <td className=" px-6 py-4 border-t">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleEdit(news)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow text-sm"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(news.id)}
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
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No news available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center p-6 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-200 px-4 py-2 rounded-md disabled:opacity-50"
          >
             Prev
          </button>
          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-gray-200 px-4 py-2 rounded-md disabled:opacity-50"
          >
            Next 
          </button>
        </div>
      )}
    </section>
  );
}
