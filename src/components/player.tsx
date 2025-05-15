"use client";

import { useEffect, useState } from "react";

interface PlayerInput {
  name: string;
  position: string;
  contact_info: string;
  team_id?: string;
  image: string;
}

export default function Player() {
  const [players, setPlayers] = useState<PlayerInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("/api/player");
        if (!res.ok) {
          throw new Error("Failed to fetch players");
        }
        const data = await res.json();
        setPlayers(data.data || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) return <p className="px-8 py-6">Loading players...</p>;
  if (error) return <p className="px-8 py-6 text-red-500">{error}</p>;

  return (
    <section className="px-8 py-6">
      <h2 className="text-4xl font-bold text-blue-600 mb-8 ">Player List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {players.map((player, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md overflow-hidden border border-blue-100 hover:shadow-blue-400 transition duration-300"
          >
            <div className="h-[300px] w-full overflow-hidden">
              <img
                src={player.image || "https://via.placeholder.com/300x300"}
                alt={player.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-4 text-left space-y-2">
              <p className="text-lg font-semibold text-blue-700">
                Name: {player.name}
              </p>
              <p className="text-md text-blue-600">
                Position: {player.position}
              </p>
              <p className="text-md text-blue-600">
                Contact: {player.contact_info}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
