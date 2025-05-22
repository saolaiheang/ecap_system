"use client";

import Header from "../../../components/header";
import TypesOfSport from "../../../components/typeSport";
import News from "../../../components/news";
import TestVideo from "@/components/video";

export default function Homepage() {
  return (
    <div>
      <Header />
      <TestVideo />

      <div>
        {/* <MatchLayout /> */}

        <TypesOfSport />
        <News />
        {/* <Coach /> */}
        {/* <Player /> */}
      </div>
    </div>
  );
}
