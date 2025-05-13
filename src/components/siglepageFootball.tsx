"use client";
import Image from "next/image";
import piture from "../../public/image/b.jpg"
import Header from "./header";
import Player from "./player";


export default function SinglepageFootball() {
  return (

    <>
   <Header/>
    
    <div className="container mx-auto px-4 py-8">
      <div className="header text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">BASKETBALL</h1>
      </div>

      <div className="image-container mb-8">
        <img
          src={piture}
          alt="Basketball Group"
          className="main-image w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      <div className="activity-container">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activity</h2>
        <div className="activity-boxes grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="activity-box bg-blue-500 p-6 rounded-lg shadow-lg"></div>
          <div className="activity-box bg-blue-500 p-6 rounded-lg shadow-lg"></div>
          <div className="activity-box bg-blue-500 p-6 rounded-lg shadow-lg"></div>
          <div className="activity-box bg-blue-500 p-6 rounded-lg shadow-lg"></div>
        </div>
      </div>
    </div>

    <Player/>
    </>
  );
}
