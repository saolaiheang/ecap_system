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
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Types of Sport</h1>
            <button
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
            >
                Add New Sport
            </button>
            {loading ? (
                <p>Loading...</p>
            ) : sports && sports.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm sm:text-base">
                        <thead className="bg-blue-800 text-white">
                            <tr>
                                <th className="border px-4 py-2 text-left">No</th>
                                <th className="border px-4 py-2 text-left">Image</th>
                                <th className="border px-4 py-2 text-left">Name</th>
                                <th className="border px-4 py-2 text-left">Description</th>
                                <th className="border px-4 py-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sports.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={100}
                                            height={100}
                                            className="object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="border px-4 py-2">{item.name}</td>
                                    <td className="border px-4 py-2">{item.description || "No description"}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No sports data found.</p>
            )}

            {isCreating && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Create New Sport</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border p-2 mt-1"
                                />
                            </div>
                            <div>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full border p-2 mt-1"
                                />
                            </div>
                            <div>
                                <label htmlFor="image">Image</label>
                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="w-full border p-2 mt-1"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    setIsCreating(false);
                                    setFormData({ name: "", description: "", image: "" });
                                }}
                                disabled={isUpdating}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={isUpdating}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                {isUpdating ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingSportId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Edit Sport</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border p-2 mt-1"
                                />
                            </div>
                            <div>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full border p-2 mt-1"
                                />
                            </div>
                            <div>
                                <label htmlFor="image">Image</label>
                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="w-full border p-2 mt-1"
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
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                onClick={closeEditModal}
                                disabled={isUpdating}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleUpdate(editingSportId)}
                                disabled={isUpdating}
                                className="bg-green-600 text-white px-4 py-2 rounded"
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
