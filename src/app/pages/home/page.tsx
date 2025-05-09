"use client";

import { useState } from "react";
import Image from "next/image";
import TypesOfSport from "../../../components/typeSport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/header";
import News from "../../../components/news";
import Coach from "../../../components/coach";
import Player from "../../../components/player";


export default function Homepage() {
  return (
    <div>
      <Header />

      <div className="w-full h-[500px] overflow-hidden">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          controls
        >
          <source src="/homepagevideo.mp4" type="video/mp4" />

        </video>
      </div>

      <div>
        <TypesOfSport />
        <News />
        <Coach />
        <Player />
      </div>
    </div>
  );
}
