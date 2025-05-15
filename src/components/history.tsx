"use client";

export default function HistorySection() {
  const items = [
    {
      year: "2019",
      text: "The mission of sport is to promote physical health, mental strength, and social development among individuals of all ages. Sport encourages fair play, respect, and teamwork.",
      image: "/image-placeholder.png",
    },
    {
      year: "2020",
      text: "Sports initiatives expanded across the country, focusing on youth engagement and gender inclusion through school-based programs and community events.",
      image: "/image-placeholder.png",
    },
    {
      year: "2021",
      text: "A new national program for sports leadership and coaching was launched, empowering young people to lead teams and build character through football and volleyball.",
      image: "/image-placeholder.png",
    },
  ];

  return (
    <section className="bg-white px-6 md:px-20 py-16">
      <h2 className="text-4xl text-blue-900 font-extrabold text-center mb-16">
        🛤️ Our Journey
      </h2>

      <div className="relative border-l-4 border-blue-900 pl-6">
        {items.map((item, i) => (
          <div key={i} className="mb-16 relative group">
            {/* Year circle */}
            <div className="absolute -left-[33px] top-0 bg-blue-900 text-white w-[66px] h-[66px] rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10 border-4 border-white">
              {item.year}
            </div>

            {/* Timeline line extension */}
            <div className="absolute -left-1 top-[66px] h-[calc(100%-66px)] w-2 bg-blue-200"></div>

            {/* Content block */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg md:flex md:items-center gap-6 transition-transform duration-300 group-hover:scale-[1.02]">
              <img
                src={item.image}
                alt={`History ${item.year}`}
                className="w-full md:w-[240px] h-[160px] object-cover rounded-xl shadow-md"
              />

              <div className="mt-4 md:mt-0">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">
                  {item.year}
                </h3>
                <p className="text-gray-700 leading-relaxed text-[15px] tracking-wide">
                  {item.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
