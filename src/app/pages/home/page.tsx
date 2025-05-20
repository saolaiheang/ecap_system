"use client";

import Header from "../../../components/header";
import TypesOfSport from "../../../components/typeSport";
import News from "../../../components/news";
import Coach from "../../../components/coach";
import Player from "../../../components/player";
import MatchLayout from "@/components/matchLayout";
import TestVideo from "@/components/video";

export default function Homepage() {
  return (
    <div>
      <Header />
      <TestVideo />

      <div>
        <MatchLayout />

        <TypesOfSport />
        <News />
        {/* <Coach /> */}
        {/* <Player /> */}
      </div>
    </div>
  );
}
