import Navbar from "./components/Nav.tsx";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home.tsx";
import Projects from "./pages/Projects/Projects.tsx";
import Team from "./pages/Team/Team.tsx";
import MemberDetailPage from "./pages/Team/Profile.tsx";
import TransitionProvider from "./providers/TransitionProvider.tsx";

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
          <Route path="/team" element={<Team />} />
          <Route path={`/team/:memberId`} element={<MemberDetailPage />} />
        </Routes>
      </TransitionProvider>
    </>
  );
}

export default RoutesNav;
