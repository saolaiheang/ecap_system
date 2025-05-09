"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const sports = [
  {
    title: "FOOTBALL",
    description:
      "Football, known as soccer in some countries, is one of the most popular sports worldwide.",
    image: "/image/pseLogo.png",
  },
  {
    title: "FOOTBALL",
    description:
      "Football, known as soccer in some countries, is one of the most popular sports worldwide.",
    image: "/image/b.jpg",
  },
  {
    title: "HOCKEY",
    description:
      "Football, known as soccer in some countries, is one of the most popular sports worldwide.",
    image: "/sports3.jpg",
  },
  {
    title: "BASKETBALL",
    description:
      "Football, known as soccer in some countries, is one of the most popular sports worldwide.",
    image: "/sports4.jpg",
  },
  {
    title: "BASKETBALL",
    description:
      "Football, known as soccer in some countries, is one of the most popular sports worldwide.",
    image: "/sports4.jpg",
  },
  {
    title: "BASKETBALL",
    description:
      "Football, known as soccer in some countries, is one of the most popular sports worldwide.",
    image: "/sports4.jpg",
  },
  {
    title: "BASKETBALL",
    description:
      "Football, known as soccer in some countries, is one of the most popular sports worldwide.",
    image: "/sports4.jpg",
  },
  {
    title: "BASKETBALL",
    description:
      "Football, known as soccer in some countries, is one of the most popular sports worldwide.",
    image: "/sports4.jpg",
  },
];

export default function TypesOfSport() {
  const [showAll, setShowAll] = useState(false);

  const displayedSports = showAll ? sports : sports.slice(0, 4);

  return (
    <section className="px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-500">Type of Sport</h1>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 hover:underline font-medium"
        >
          {showAll ? "Show less" : "See all"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {displayedSports.map((sport, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden shadow-lg"
          >
            <Image
              src={sport.image}
              alt={sport.title}
              width={300}
              height={200}
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 text-white">
              <h2 className="text-[25px] font-bold">{sport.title}</h2>
              <p className="text-[17px] hover:text-[#cf89b8] hover:font-bold ">{sport.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
