// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import HeaderAdminPage from "@/components/headerAdmin";
// import {
//   FaUser,
//   FaChevronDown,
//   FaCalendarAlt,
//   FaUsers,
//   FaNewspaper,
//   FaHistory,
//   FaChartLine,
// } from "react-icons/fa";
// import FetchNews from "@/components/fetchnews";
// import FetchActivityD from "@/components/fetchActivityD";
// import ProfileDashboard from "@/components/fetchprofileD";
// import FetchProfileCoach from "@/components/fetchProfileCoachD";
// import { FC } from "react";
// import FetchMatch from "@/components/fetchMatch";
// import FetchHisotry from "@/components/fetchHistoryD";
// import FetchSchedule from "@/components/fetchSchedule";
// import CompetitionManager from "@/components/fetchcompetition";

// interface CommonProps {
//   sport: string;
// }

// const FetchNewsWrapper: FC<CommonProps> = ({ sport }) => (
//   <FetchNews sport={sport} />
// );
// const FetchCompetitionWrapper: FC<CommonProps> = ({ sport }) => (
//   <CompetitionManager sport={sport} />
// );
// const FetchActivityDWrapper: FC<CommonProps> = ({ sport }) => (
//   <FetchActivityD sport={sport} />
// );
// const ProfileDashboardWrapper: FC<CommonProps> = ({ sport }) => (
//   <ProfileDashboard sport={sport} />
// );
// const FetchMatchWrapper: FC<CommonProps> = ({ sport }) => (
//   <FetchMatch sport={sport} />
// );
// const FetchProfileCoachWrapper: FC<CommonProps> = ({ sport }) => (
//   <FetchProfileCoach sport={sport} />
// );
// const FetchHistoryWrapper: FC<CommonProps> = ({ sport }) => (
//   <FetchHisotry sport={sport} />
// );
// const FetchScheduleWrapper: FC<CommonProps> = ({ sport }) => (
//   <FetchSchedule sport={sport} />
// );

// export default function DashboardLayout() {
//   const router = useRouter();
//   const [selectedContent, setSelectedContent] = useState<string>("dashboard");
//   const [profileMenuOpen, setProfileMenuOpen] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/pages/login");
//     }
//   }, [router]);

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <HeaderAdminPage />
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <aside className="w-64 bg-[#2C357C] text-white flex flex-col py-4 px-2 shadow-lg space-y-2">
//           <button
//             className="flex items-center px-3 py-3 text-sm hover:bg-[#e66dbd] rounded transition"
//             onClick={() => setSelectedContent("history")}
//           >
//             <FaHistory className="mr-3" />
//             History
//           </button>

//           {/* Profile dropdown */}
//           <div>
//             <button
//               className="flex items-center w-full px-3 py-3 text-sm hover:bg-[#e66dbd] rounded transition"
//               onClick={() => setProfileMenuOpen(!profileMenuOpen)}
//             >
//               <FaUser className="mr-3" />
//               Profile
//               <FaChevronDown
//                 className={`ml-auto transition-transform ${
//                   profileMenuOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </button>
//             {profileMenuOpen && (
//               <div className="bg-[#3b478f] ml-8 mt-1 text-xs p-2 rounded space-y-1">
//                 <p
//                   className="cursor-pointer hover:underline"
//                   onClick={() => setSelectedContent("profile-player")}
//                 >
//                   Player
//                 </p>
//                 <p
//                   className="cursor-pointer hover:underline"
//                   onClick={() => setSelectedContent("profile-coach")}
//                 >
//                   Coach
//                 </p>
//               </div>
//             )}
//           </div>

//           <button
//             className="flex items-center px-3 py-3 text-sm hover:bg-[#e66dbd] rounded transition"
//             onClick={() => setSelectedContent("schedule")}
//           >
//             <FaCalendarAlt className="mr-3" />
//             Schedule
//           </button>

//           <button
//             className="flex items-center px-3 py-3 text-sm hover:bg-[#e66dbd] rounded transition"
//             onClick={() => setSelectedContent("match")}
//           >
//             <FaUsers className="mr-3" />
//             Match
//           </button>

//           <button
//             className="flex items-center px-3 py-3 text-sm hover:bg-[#e66dbd] rounded transition"
//             onClick={() => setSelectedContent("news")}
//           >
//             <FaNewspaper className="mr-3" />
//             News
//           </button>

//           <button
//             className="flex items-center px-3 py-3 text-sm hover:bg-[#e66dbd] rounded transition"
//             onClick={() => setSelectedContent("competition")}
//           >
//             <FaNewspaper className="mr-3" />
//             Competition
//           </button>

//           <button
//             className="flex items-center px-3 py-3 text-sm hover:bg-[#e66dbd] rounded transition"
//             onClick={() => setSelectedContent("activity")}
//           >
//             <FaChartLine className="mr-3" />
//             Activity
//           </button>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6 bg-white">
//           {selectedContent === "news" ? (
//             <FetchNewsWrapper sport="default" />
//           ) : selectedContent === "profile-player" ? (
//             <ProfileDashboardWrapper sport="player" />
//           ) : selectedContent === "profile-coach" ? (
//             <FetchProfileCoachWrapper sport="coach" />
//           ) :selectedContent === "schedule" ? (
//             <FetchScheduleWrapper sport="default" />
//           ) : selectedContent === "competition" ? (
//             <FetchCompetitionWrapper sport="default" />
//           ) : selectedContent === "activity" ? (
//             <FetchActivityDWrapper sport="default" />
//           ) : selectedContent === "history" ? (
//             <FetchHistoryWrapper sport="default" />
//           ) :selectedContent === "match" ? (
//             <FetchMatchWrapper sport="default" />
//           ) : 
//           (
//             <h2 className="text-xl font-semibold text-[#1D276C]">Dashboard</h2>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }



"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeaderAdminPage from "@/components/headerAdmin";
import {
  FaUser,
  FaChevronDown,
  FaCalendarAlt,
  FaUsers,
  FaNewspaper,
  FaHistory,
  FaChartLine,
  FaTrophy,
} from "react-icons/fa";
import FetchNews from "@/components/fetchnews";
import FetchActivityD from "@/components/fetchActivityD";
import ProfileDashboard from "@/components/fetchprofileD";
import FetchProfileCoach from "@/components/fetchProfileCoachD";
import FetchMatch from "@/components/fetchMatch";
import FetchHistory from "@/components/fetchHistoryD";
import FetchSchedule from "@/components/fetchSchedule";
import CompetitionManager from "@/components/fetchcompetition";



export default function DashboardLayout() {
  const router = useRouter();
  const [selectedContent, setSelectedContent] = useState<string>("dashboard");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/pages/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HeaderAdminPage />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-[#2C357C] text-white flex flex-col py-4 px-2 shadow-lg space-y-2">
          <button
            className="flex items-center px-3 py-3 text-sm hover:bg-[#4B5A9E] rounded transition"
            onClick={() => setSelectedContent("history")}
            aria-label="View History"
          >
            <FaHistory className="mr-3" />
            History
          </button>

          {/* Profile dropdown */}
          <div>
            <button
              className="flex items-center w-full px-3 py-3 text-sm hover:bg-[#4B5A9E] rounded transition"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              aria-expanded={profileMenuOpen}
              aria-label="Toggle Profile Menu"
            >
              <FaUser className="mr-3" />
              Profile
              <FaChevronDown
                className={`ml-auto transition-transform ${
                  profileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {profileMenuOpen && (
              <div className="bg-[#3b478f] ml-8 mt-1 text-xs p-2 rounded space-y-1">
                <p
                  className="cursor-pointer hover:underline"
                  onClick={() => setSelectedContent("profile-player")}
                >
                  Player
                </p>
                <p
                  className="cursor-pointer hover:underline"
                  onClick={() => setSelectedContent("profile-coach")}
                >
                  Coach erty
                </p>
              </div>
            )}
          </div>

          <button
            className="flex items-center px-3 py-3 text-sm hover:bg-[#4B5A9E] rounded transition"
            onClick={() => setSelectedContent("schedule")}
            aria-label="View Schedule"
          >
            <FaCalendarAlt className="mr-3" />
            Schedule
          </button>

          <button
            className="flex items-center px-3 py-3 text-sm hover:bg-[#4B5A9E] rounded transition"
            onClick={() => setSelectedContent("match")}
            aria-label="View Matches"
          >
            <FaUsers className="mr-3" />
            Match
          </button>

          <button
            className="flex items-center px-3 py-3 text-sm hover:bg-[#4B5A9E] rounded transition"
            onClick={() => setSelectedContent("news")}
            aria-label="View News"
          >
            <FaNewspaper className="mr-3" />
            News
          </button>

          <button
            className="flex items-center px-3 py-3 text-sm hover:bg-[#4B5A9E] rounded transition"
            onClick={() => setSelectedContent("competition")}
            aria-label="View Competitions"
          >
            <FaTrophy className="mr-3" />
            Competition
          </button>

          <button
            className="flex items-center px-3 py-3 text-sm hover:bg-[#4B5A9E] rounded transition"
            onClick={() => setSelectedContent("activity")}
            aria-label="View Activity"
          >
            <FaChartLine className="mr-3" />
            Activity
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white">
          {selectedContent === "news" ? (
            <FetchNews sport="default" />
          ) : selectedContent === "profile-player" ? (
            <ProfileDashboard sport="player" />
          ) : selectedContent === "profile-coach" ? (
            <FetchProfileCoach sport="coach" />
          ) : selectedContent === "schedule" ? (
            <FetchSchedule sport="default" />
          ) : selectedContent === "competition" ? (
            <CompetitionManager sport="default" />
          ) : selectedContent === "activity" ? (
            <FetchActivityD sport="default" />
          ) : selectedContent === "history" ? (
            <FetchHistory /> // Removed sport prop
          ) : selectedContent === "match" ? (
            <FetchMatch sport="default" />
          ) : (
            <h2 className="text-xl font-semibold text-[#1D276C]">Dashboard</h2>
          )}
        </main>
      </div>
    </div>
  );
}