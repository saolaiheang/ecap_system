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
import Image from "next/image";
import { FaListAlt } from "react-icons/fa";

import FetchNews from "@/components/fetchnews";
import FetchActivityD from "@/components/fetchActivityD";
import ProfileDashboard from "@/components/fetchprofileD";
import FetchProfileCoach from "@/components/fetchProfileCoachD";
import FetchMatch from "@/components/fetchMatch";
import FetchHistory from "@/components/fetchHistoryD";
import FetchSchedule from "@/components/fetchSchedule";
import CompetitionManager from "@/components/fetchcompetition";
import CompetitionStagesPage from "@/app/competitions/[competitionId]/stages/page";
import DeshboardSportType from "@/components/fetchSportType";
import FetchTeam from "@/components/fetchTeamD";


function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;

    const decodedPayload = JSON.parse(atob(payloadBase64));
    if (!decodedPayload.exp) return true;

    const expiryTimeMs = decodedPayload.exp * 1000;
    return Date.now() > expiryTimeMs;
  } catch {
    return true;
  }
}

import { FaFutbol } from "react-icons/fa";


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
      <div className="flex flex-1">
        <aside className="w-64 bg-gradient-to-b from-[#2C357C] to-[#1B1F3B] text-white flex flex-col py-6 px-3 shadow-xl space-y-3">
          <div className="flex justify-center mb-6">
            <Image
              src="/image/pseLogo.png"
              alt="PSE Logo"
              width={250}
              height={180}
              className="w-[180px] h-auto object-contain"
              priority={true}
            />
          </div>

          <button
            className="flex items-center px-4 py-3 text-[16px] font-semibold rounded-lg hover:bg-[#4B5A9E] transition duration-200"
            onClick={() => setSelectedContent("sporttypes")}
          >
            <FaFutbol className="mr-4 text-xl" />
            Sport Types
          </button>

          <button
            className="flex items-center px-4 py-3 text-[16px] font-semibold rounded-lg hover:bg-[#4B5A9E] transition duration-200"
            onClick={() => setSelectedContent("history")}
          >
            <FaHistory className="mr-4 text-xl" />
            History
          </button>

          <div>
            <button
              className="flex items-center justify-between w-full px-4 py-3 text-[16px] font-semibold rounded-lg hover:bg-[#4B5A9E] transition duration-200"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <span className="flex items-center">
                <FaUser className="mr-4 text-xl" />
                Profile
              </span>
              <FaChevronDown
                className={`ml-auto text-xl transition-transform ${
                  profileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {profileMenuOpen && (
              <div className="ml-10 mt-2 space-y-2 text-[15px] text-gray-300">
                <p
                  className="cursor-pointer hover:underline hover:text-white"
                  onClick={() => setSelectedContent("profile-player")}
                >
                  Player
                </p>
                <p
                  className="cursor-pointer hover:underline hover:text-white"
                  onClick={() => setSelectedContent("profile-coach")}
                >
                  Coach
                </p>
              </div>
            )}
          </div>

          <button
            className="flex items-center px-4 py-3 text-[16px] font-semibold rounded-lg hover:bg-[#4B5A9E] transition duration-200"
            onClick={() => setSelectedContent("schedule")}
          >
            <FaCalendarAlt className="mr-4 text-xl" />
            Schedule
          </button>

          <button
            className="flex items-center px-4 py-3 text-[16px] font-semibold rounded-lg hover:bg-[#4B5A9E] transition duration-200"
            onClick={() => setSelectedContent("match")}
          >
            <FaUsers className="mr-4 text-xl" />
            Match
          </button>

          <button
            className="flex items-center px-4 py-3 text-[16px] font-semibold rounded-lg hover:bg-[#4B5A9E] transition duration-200"
            onClick={() => setSelectedContent("news")}
          >
            <FaNewspaper className="mr-4 text-xl" />
            News
          </button>

          <button
            className="flex items-center px-4 py-3 text-[16px] font-semibold rounded-lg hover:bg-[#4B5A9E] transition duration-200"
            onClick={() => setSelectedContent("competition")}
          >
            <FaTrophy className="mr-4 text-xl" />
            Competition
          </button>

          <button
            className="flex items-center px-4 py-3 text-[16px] font-semibold rounded-lg hover:bg-[#4B5A9E] transition duration-200"
            onClick={() => setSelectedContent("activity")}
          >
            <FaChartLine className="mr-4 text-xl" />
            Activity
          </button>
        </aside>

        <main className="flex-1 p-6 bg-white">
          {selectedContent === "news" ? (
            <FetchNews sport="default" />
          ) : selectedContent === "profile-player" ? (
            <ProfileDashboard />
          ) : selectedContent === "profile-coach" ? (
            <FetchProfileCoach />
          ) : selectedContent === "schedule" ? (
            <FetchSchedule sport="default" />
          ) : selectedContent === "competition" ? (
            <CompetitionManager />
          ) : selectedContent === "activity" ? (
            <FetchActivityD />
          ) : selectedContent === "history" ? (
            <FetchHistory />
          ) : selectedContent === "match" ? (
            <FetchMatch sport="default" />
          ) : selectedContent === "stages" ? (
            <CompetitionStagesPage />
          ) : selectedContent === "sporttypes" ? (
            <DeshboardSportType />
          ) : (
            <h2 className="text-xl font-semibold text-[#1D276C]">Dashboard</h2>
          )}
        </main>
      </div>
    </div>
  );
}
