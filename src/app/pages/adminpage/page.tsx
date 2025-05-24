
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
import CompetitionStagesPage from "@/app/competitions/[competitionId]/stages/page"




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
        <aside className="w-64 bg-[#2C357C] text-white flex flex-col py-4 px-2 shadow-lg space-y-2">
          <button
            className="flex items-center px-3 py-3 text-sm hover:bg-[#4B5A9E] rounded transition"
            onClick={() => setSelectedContent("history")}
            aria-label="View History"
          >
            <FaHistory className="mr-3" />
            History
          </button>

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

        <main className="flex-1 p-6 bg-white">
          {selectedContent === "news" ? (
            <FetchNews sport="default" />
          ) : selectedContent === "profile-player" ? (
            <ProfileDashboard  />
          ) : selectedContent === "profile-coach" ? (
            <FetchProfileCoach />
          ) : selectedContent === "schedule" ? (
            <FetchSchedule sport="default" />
          ) : selectedContent === "competition" ? (
            <CompetitionManager />
          ) : selectedContent === "activity" ? (
            <FetchActivityD sport="default" />
          ) : selectedContent === "history" ? (
            <FetchHistory /> 
          ) : selectedContent === "match" ? (
            <FetchMatch sport="default" />
          ) :selectedContent=== "stages"?(
            <CompetitionStagesPage/>
          ): (
            <h2 className="text-xl font-semibold text-[#1D276C]">Dashboard</h2>
          )}
        </main>
      </div>
    </div>
  );
}