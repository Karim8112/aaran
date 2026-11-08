import Navbar from "./components/Nav.tsx";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home.tsx";
// import UnderConstruction from "./pages/underConstruction.tsx";
import Team from "./pages/Team/Team.tsx";
import Youtube from "../src/pages/Videos/index2.tsx";
import MemberDetailPage from "./pages/Team/Profile.tsx";
import TransitionProvider from "./providers/TransitionProvider.tsx";
import Projects from "./pages/Projects/Projects.tsx";
import ShowProject from "./pages/Projects/showProject.tsx";
import House from "./pages/Estate/index.tsx";
import ShowHouse from "./pages/Estate/ShowHouse.tsx";

function RoutesNav() {
  return (
    <>
      <TransitionProvider>
        <div className="container relative">
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ShowProject />} />
          <Route path="/team" element={<Team />} />
          <Route path="/videos" element={<Youtube />} />
          <Route path={`/team/:memberId`} element={<MemberDetailPage />} />
          <Route path="/estates" element={<House />} />
          <Route path={`/estates/:houseId`} element={<ShowHouse />} />

          {/* estates */}
        </Routes>
      </TransitionProvider>
    </>
  );
}

export default RoutesNav;
