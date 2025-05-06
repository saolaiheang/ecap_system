"use client";

import Image from "next/image";


const announcements = [
  {
    title: "PSE Charity ",
    image: "/image/b.jpg",
    large: true,
  },
  {
    title: "PSE Charity at 2024 We hav a lot of match",
    image: "/image/pseLogo.png",
    description: "hello",
  },
  {
    title: "PSE Charity at 2024 We hav a lot of match",
    image: "/sports3.jpg",
    description: "hello",

  },
  {
    title: "PSE Charity at 2024 We hav a lot of match",
    image: "/sports4.jpg",
    description: "hello",

  },
];

export default function News() {
  return (
    <section className="px-8 py-6">

        <h2 className="text-3xl font-bold text-orange-500 mb-4">Announcements</h2>
        <div className="grid">
          <div className="relative h-[500px] rounded-xl overflow-hidden">
            <Image
              src={announcements[0].image}
              alt="announcement"
              fill
              className="object-cover w-[100%]"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-center p-4">
              <h3 className="text-xl md:text-2xl font-semibold leading-tight">
                {announcements[0].title}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-[30px]">
            {announcements.slice(1).map((item, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-md">
                <Image
                  src={item.image}
                  alt="announcement"
                  width={400}
                  height={200}
                  className="object-cover w-full h-40"
                />
                <h1 className="p-4 text-[20px]  font-medium">{item.title}</h1>
                <p className="p-4 text-[15px]  font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    

     
  );
}
