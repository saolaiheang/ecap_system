// // "use client";

// // import Image from "next/image";

// // const announcements = [
// //   {
// //     title: "PSE Charity ",
// //     image: "/image/b.jpg",
// //     large: true,
// //   },
// //   {
// //     title: "PSE Charity at 2024 We hav a lot of match",
// //     image: "/image/pseLogo.png",
// //     description: "hello",
// //   },
// //   {
// //     title: "PSE Charity at 2024 We hav a lot of match",
// //     image: "/sports3.jpg",
// //     description: "hello",

// //   },
// //   {
// //     title: "PSE Charity at 2024 We hav a lot of match",
// //     image: "/sports4.jpg",
// //     description: "hello",

// //   },
// // ];

// // export default function News() {
// //   return (
// //     <section className="px-8 py-6">

// //         <h2 className="text-3xl font-bold text-orange-500 mb-4">Announcements</h2>
// //         <div className="grid">
// //           <div className="relative h-[500px] rounded-xl overflow-hidden">
// //             <Image
// //               src={announcements[0].image}
// //               alt="announcement"
// //               fill
// //               className="object-cover w-[100%]"
// //             />
// //             <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-center p-4">
// //               <h3 className="text-xl md:text-2xl font-semibold leading-tight">
// //                 {announcements[0].title}
// //               </h3>
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-[30px]">
// //             {announcements.slice(1).map((item, i) => (
// //               <div key={i} className="rounded-xl overflow-hidden shadow-md">
// //                 <Image
// //                   src={item.image}
// //                   alt="announcement"
// //                   width={400}
// //                   height={200}
// //                   className="object-cover w-full h-40"
// //                 />
// //                 <h1 className="p-4 text-[20px]  font-medium">{item.title}</h1>
// //                 <p className="p-4 text-[15px]  font-medium">{item.description}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //   );
// // }



// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";

// interface NewsItem {
//   id: string;
//   title: string;
//   description: string;
//   image: string; // base64 encoded
//   date: string;
// }

// export default function News() {
//   const [news, setNews] = useState<NewsItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const res = await fetch("/api/news");
//         const data = await res.json();
//         console.log("Fetched News Data:", data); 
//         setNews(data); 
        
//       } catch (error) {
//         console.error("Error fetching news:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchNews();
//   }, []);
  

//   if (loading) {
//     return <div className="px-8 py-6 text-xl">Loading...</div>;
//   }

//   if (!news || news.length === 0) {
//     return <div className="px-8 py-6 text-xl text-red-500">No news found.</div>;
//   }

//   return (
//     <section className="px-8 py-6">
//       <h2 className="text-3xl font-bold text-orange-500 mb-4">Announcements</h2>

//       {/* Featured news */}
//       {news.length > 0 && (
//         <div className="relative h-[500px] rounded-xl overflow-hidden">
//           <Image
//             src={`data:image/jpeg;base64,${news[0].image}`}
//             alt={news[0].title}
//             fill
//             className="object-cover w-full"
//           />
//           <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-center p-4">
//             <h3 className="text-xl md:text-2xl font-semibold leading-tight">
//               {news[0].title}
//             </h3>
//           </div>
//         </div>
//       )}

//       {/* Other news */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
//         {Array.isArray(news) && news.length > 1 && news.slice(1).map((item) => (
//           <div key={item.id} className="rounded-xl overflow-hidden shadow-md bg-white">
//             <Image
//               src={`${item.image}`}
//               alt={item.title}
//               width={400}
//               height={200}
//               className="object-cover w-full h-40"
//             />
//             <div className="p-4">
//               <h1 className="text-[20px] font-medium">{item.title}</h1>
//               <p className="text-sm text-gray-600 mt-2">{item.description}</p>
//               <p className="text-xs text-gray-400 mt-1">{item.date}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string; // base64 encoded or full URL
  date: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        console.log("Fetched News Data:", data.data);
        if (Array.isArray(data.data)) {
          setNews(data.data);
        } else {
          console.error("API response is not an array:", data.data);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      {loading ? (
        <div className="px-8 py-6 text-xl">Loading...</div>
      ) : !news || news.length === 0 ? (
        <div className="px-8 py-6 text-xl text-red-500">No news found.</div>
      ) : (
        <section className="px-8 py-6">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Announcements</h2>

          {/* Featured news */}
          <div className="relative h-[500px] rounded-xl overflow-hidden">
            <Image
              src={`data:image/jpeg;base64,${news[0].image}`}
              alt={news[0].title}
              fill
              className="object-cover w-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-center p-4">
              <h3 className="text-xl md:text-2xl font-semibold leading-tight">
                {news[0].title}
              </h3>
            </div>
          </div>

          {/* Other news */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {news.slice(1).map((item) => (
              <div key={item.id} className="rounded-xl overflow-hidden shadow-md bg-white">
                <Image
                  src={item.image.startsWith("data:image") ? item.image : `data:image/jpeg;base64,${item.image}`}
                  alt={item.title}
                  width={400}
                  height={200}
                  className="object-cover w-full h-40"
                />
                <div className="p-4">
                  <h1 className="text-[20px] font-medium">{item.title}</h1>
                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
