"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface SportType {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function DetailTypeOfSport() {
  const params = useParams();
  const id = params?.id as string;
  const [sport, setSport] = useState<SportType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchSportDetail = async () => {
      try {
        const res = await fetch(`/api/typeofsport/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch sport detail");
        }
        const data = await res.json();
        setSport(data.typeOfSport);
      } catch (err) {
        setError("Failed to load sport detail.");
      } finally {
        setLoading(false);
      }
    };

    fetchSportDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 semibold">Loading...</div>
    );
  }

  if (error || !sport) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        {error || "Sport not found."}
      </div>
    );
  }

  return (
    <>
      <main className="px-6 sm:px-10 md:px-[100px] py-10 max-w-5xl mx-auto text-black font-sans">
        <div className="relative w-full h-64 sm:h-96 mb-6 rounded-xl overflow-hidden">
          <Image
            src={sport.image || "/placeholder.jpg"}
            alt={sport.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <h1 className="absolute bottom-4 left-4 text-white text-2xl sm:text-4xl font-bold drop-shadow-lg">
            {sport.name}
          </h1>
        </div>

        {/* <p className="text-base sm:text-lg text-gray-800 leading-relaxed whitespace-pre-line">
          {sport.description}
        </p> */}
      </main>
    </>
  );
}
