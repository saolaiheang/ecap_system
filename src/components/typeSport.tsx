"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
      } catch (error) {
        console.error("Failed to fetch types of sport:", error);
      }
    };

    fetchSports();
  }, []);

  return (
    <section className="px-4 sm:px-6 md:px-[100px] lg:px-[150px] py-10">
      <div className="flex flex-col items-start sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent drop-shadow-lg">
          Types of Sport
        </h1>
       

        <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-medium shadow-md transition"
          >
            {showAll ? "Show Less" : "Show All"}
          </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {displayedSports.map((sport) => (
          <Link href={`/typeofsport/${sport.id}`} key={sport.id}>

            <div className="relative h-56 sm:h-60 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 group cursor-pointer">
              <Image
                src={sport?.image || "/placeholder.jpg"}
                alt={sport.name || "Sport Image"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-700 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition duration-300"></div>
              <div className="absolute bottom-0 p-4 text-white">
                <h2 className="text-lg sm:text-xl font-bold">{sport.name}</h2>
                <p className="text-sm sm:text-base mt-1 group-hover:font-semibold transition line-clamp-2">
                  {sport.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
