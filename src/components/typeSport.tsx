"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
interface SportType {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function TypesOfSport() {
  const [sports, setSports] = useState<SportType[]>([]);
  const [showAll, setShowAll] = useState(false);

  const displayedSports = showAll ? sports : sports.slice(0, 4);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await fetch("/api/typeofsport");
        const data = await res.json();
        if (Array.isArray(data.typeOfSport)) {
          setSports(data.typeOfSport);
        } else {
          console.error("Unexpected data format", data);
        }
        console.log('sports',data.typeOfSport)
      } catch (error) {
        console.error("Failed to fetch types of sport:", error);
      }
    };

    fetchSports();
  }, []);

  return (
    <section className="px-4 sm:px-6 md:px-[100px] lg:px-[150px] py-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 tracking-tight">
          Types of Sport
        </h1>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 hover:text-blue-800 transition duration-200 font-semibold underline-offset-4 hover:underline self-start sm:self-auto"
        >
          {showAll ? "Show less" : "See all"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {sports.length === 0 && (
    <p className="text-red-500 col-span-full text-center text-lg">
      No sports found.
    </p>
  )}

  {displayedSports.map((sport) => (
    <div
      key={sport.id}
      className="relative h-60 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 group"
    >
      <Image
        src={sport?.image || "/placeholder.jpg"}
        alt={sport.name || "News Image"}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition duration-300"></div>
      <div className="absolute bottom-0 p-4 text-white">
        <h2 className="text-lg sm:text-xl font-bold">{sport.name}</h2>
        <p className="text-sm sm:text-base mt-1 group-hover:text-blue-100 hover:font-semibold transition line-clamp-2">
          {sport.description}
        </p>
      </div>
    </div>
  ))}
</div>

    </section>
  );
}
