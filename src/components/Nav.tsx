// import { Link } from "react-router-dom";

import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const activeClass = "text-[#D1B797] font-normal border-b-1"; // Replace with your selection class

  const getClass = (path: string) =>
    location.pathname === path ? activeClass : "";

  return (
    <nav className="nav-links flex  justify-center items-center pt-6 gap-16 font-light h-16 text-white  fixed top-0 left-0 right-0 z-50 ">
      <Link to="/home" className={`${getClass("/home")} ${getClass("/")}`}>
        Home
      </Link>
      <Link to="/projects" className={getClass("/projects")}>
        Projects
      </Link>
      <Link to="/Team" className={getClass("/team")}>
        Team
      </Link>
      {/* <Link to="/staff">Staff</Link>
      <Link to="/about">About Us</Link> */}
    </nav>
  );
}
