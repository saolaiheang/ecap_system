"use client";

import { useState } from "react";
import Image from "next/image";

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
      "Hockey is a fast-paced sport played on ice or field with sticks and a ball or puck.",
    image: "/sports3.jpg",
  },
  {
    title: "BASKETBALL",
    description:
      "Basketball is a dynamic team sport where players aim to score by shooting a ball through a hoop.",
    image: "/sports4.jpg",
  },
  {
    title: "BASKETBALL",
    description:
      "Basketball is a dynamic team sport where players aim to score by shooting a ball through a hoop.",
    image: "/sports4.jpg",
  },
  {
    title: "BASKETBALL",
    description:
      "Basketball is a dynamic team sport where players aim to score by shooting a ball through a hoop.",
    image: "/sports4.jpg",
  },
  {
    title: "BASKETBALL",
    description:
      "Basketball is a dynamic team sport where players aim to score by shooting a ball through a hoop.",
    image: "/sports4.jpg",
  },
  {
    title: "BASKETBALL",
    description:
      "Basketball is a dynamic team sport where players aim to score by shooting a ball through a hoop.",
    image: "/sports4.jpg",
  },
];

export default function TypesOfSport() {
  const [showAll, setShowAll] = useState(false);
  const displayedSports = showAll ? sports : sports.slice(0, 4);

  return (
    <section className="px-8 py-6 bg-blue-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900 tracking-tight">
          Types of Sport
        </h1>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 hover:text-blue-800 transition duration-200 font-semibold underline-offset-4 hover:underline"
        >
          {showAll ? "Show less" : "See all"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {displayedSports.map((sport, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 group"
          >
            <Image
              src={sport.image}
              alt={sport.title}
              width={300}
              height={200}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition duration-300"></div>
            <div className="absolute bottom-0 p-4 text-white">
              <h2 className="text-[25px] font-bold">{sport.title}</h2>
              <p className="text-[17px] mt-1 group-hover:text-blue-100 hover:font-bold transition">
                {sport.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
