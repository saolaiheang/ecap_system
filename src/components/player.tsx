"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
        setPlayers(data.data); // Assuming your API returns { data: [...] }
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
      <h2 className="text-3xl font-bold text-orange-500 mb-4">Player</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[30px] h-[450px]">
        {players.map((player, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden text-center">
            <div className="h-[350px] ">
            <img
              src={player.image}
              alt={player.name}              
              className="w-full h-full object-cover"
            />
            </div>

           
            <div className="p-2 text-sm text-left">
              <p><strong className="text-xl">Name:</strong> {player.name}</p>
              <p><strong className="text-xl">Position:</strong> {player.position}</p>
              <p><strong className="text-xl">Contact:</strong> {player.contact_info}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
