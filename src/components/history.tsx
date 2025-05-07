export default function HistorySection() {
    const items = [
        {
          year: "2019",
          text: "The mission of sport is to promote physical health, mental strength, and social development among individuals of all ages. Sport encourages fair play, respect, teamwork.",
          image: "/image-placeholder.png",
        },
        {
            year: "2019",
            text: "The mission of sport is to promote physical health, mental strength, and social development among individuals of all ages. Sport encourages fair play, respect, teamwork.",
            image: "/image-placeholder.png",
          },
          {
            year: "2019",
            text: "The mission of sport is to promote physical health, mental strength, and social development among individuals of all ages. Sport encourages fair play, respect, teamwork.",
            image: "/image-placeholder.png",
          },
      
    ];
  
    return (
      <section className="px-10 py-8 p-[200px]">
        <h2 className="text-center text-3xl font-semibold text-orange-500 mb-10">History</h2>
  
        <div className="space-y-8">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between items-center border-b-[3px]  border-orange-500 gap-5">
              <div className="text-6xl font-bold text-orange-500 w-[150px]  ">{item.year}</div>
  
              <div className="  text-xl leading-relaxed ">
                {item.text}
              </div>
  
              <div className="w-[500px] h-[150px] bg-gray-300 shrink-0 mb-[30px]" />

            </div>
          ))}
        </div>
        
      </section>
    );
  }
  