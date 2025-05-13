"use client";
import Header from "@/components/header";
export default function NewsPage() {
  const news = [
    {
      title: "Youth League Finals This Sunday",
      description: "Come watch the top teams compete for the championship title this weekend.",
      date: "May 12, 2025",
      image: "/images/league-finals.jpg", // Replace with your image path
    },
    {
      title: "New Training Equipment Arrives",
      description: "We've added new gear to help improve player performance and safety.",
      date: "May 10, 2025",
      image: "/images/equipment.jpg", // Replace with your image path
    },
    {
      title: "Coach Monika Wins Regional Award",
      description: "Recognized for her commitment to youth development and innovative training techniques.",
      date: "May 8, 2025",
      image: "/images/coach-award.jpg", // Replace with your image path
    },
  ];

  return (
    <>
    <Header/>
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Latest News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-black">{item.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{item.date}</p>
              <p className="text-gray-700">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
