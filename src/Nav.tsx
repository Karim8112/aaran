// import { Link } from "react-router-dom";

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav-links flex  justify-center items-center pt-6 gap-16 font-light h-14 text-white  fixed top-0 left-0 right-0 z-50 ">
      <Link to="/home">Home</Link>
      <Link to="/projects">Projects</Link>
      {/* <Link to="/staff">Staff</Link>
      <Link to="/about">About Us</Link> */}
    </nav>
  );
}
