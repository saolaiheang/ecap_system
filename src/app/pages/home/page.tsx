"use client";

import Header from "../../../components/header";
import TypesOfSport from "../../../components/typeSport";
import News from "../../../components/news";
import TestVideo from "@/components/video";
import MatchLayout from "@/components/matchLayout";
import Coach from "@/components/coach";
import Footer from "@/components/footer";
export default function Homepage() {
  return (
    <div className="">
      <Header />

      <TestVideo />

      <div>
        {/* <MatchLayout /> */}
        <TypesOfSport />
        <News />

        <Coach />
        {/* <Footer /> */}
        {/* <Player /> */}
      </div>
    </div>
  );
}
