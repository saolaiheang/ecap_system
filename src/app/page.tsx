
// import Login from "./pages/login/page"
import DetailFootball from "@/components/detailFootball";
import Homepage from "./pages/home/page";
import { Competition, SportType } from "@/entities";
import AdminPage from "@/components/fetchTypeSport";
// import Aboutpage from "./pages/about/page";
// import Typeofsport from "@/components/fetchTypeSport";
// import CompetitionD from "@/components/fetchcompetition";
// import CompetitionLayout from "@/common/competitionLayout";
// import SinglepageFootball from "@/components/siglepageFootball";
// import AdminPage from "@/components/fetchTypeSport";
import LayoutCompetition from "@/components/layoutcompetition";
import NewsDetailPage from "@/components/idnews";
import Header from "@/components/header";


export default function Home() {
  return (
    <div>
      {/* <Header/> */}
      <Homepage/>

    </div>
  );
}
