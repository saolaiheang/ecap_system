"use client";

import Header from "@/components/header";
import { useEffect, useState } from "react";
import Image from "next/image";
interface PlayerInput {
  id?: string;
  name: string;
  position: string;
  contact_info: string;
  image: string;
  team?: {
    id: string;
    name: string;
    division: string;
    contact_info: string;
    image?: string;
  };
  sport?: {
    id: string;
    name: string;
    description: string;
    image?: string;
  };
}

export default function Playerpage() {
  const [players, setPlayers] = useState<PlayerInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("/api/player");
        if (!res.ok) throw new Error("Failed to fetch players");

        const data = await res.json();

        // Assuming API response shape: { data: PlayerInput[] } or PlayerInput[]
        const playerList = Array.isArray(data) ? data : data.data || [];
        setPlayers(playerList);
      } catch (err) {
        console.error(err)
        setError( "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) return <p className="px-8 py-6 text-blue-600">Loading players...</p>;
  if (error) return <p className="px-8 py-6 text-red-500">{error}</p>;

  return (
    <>
      <Header />
      <section className="lg:px-[150px] px-12 py-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-10">
          ⚽ Player List
        </h2>

        {!players.length && (
          <p className="text-center text-red-500 text-lg font-semibold">No players found</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {players.map((player, i) => (
            <div
              key={player.id || i}
              className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-blue-400 transition duration-300"
            >
              <div className="h-[280px] w-full overflow-hidden relative">
                <Image
                  src={player.image || "https://via.placeholder.com/300x300"}
                  alt={player.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-2 text-left">
                {player.team && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xl font-semibold text-blue-900">{player.name}</p>
                    <p className="font-semibold text-blue-700">Team: {player.team.name}</p>
                    <p className="text-sm text-blue-600">Division: {player.team.division}</p>
                  </div>
                )}

                {player.sport && (
                  <div className="mt-3 text-sm text-gray-700 italic">
                    <p>
                      <strong>Sport:</strong> {player.sport.name}
                    </p>
                    <p>{player.sport.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
