// "use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import FetchCompetitionLayout from "@/components/fetchcompetitionlayout";
import MatchLayout from "@/components/matchLayout";


export default function Match(){
    return(
        <div className="">
            <Header/>
            <MatchLayout/>
      <FetchCompetitionLayout/>

            <Footer/>
        </div>
    )
}