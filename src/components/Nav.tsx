import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const activeClass =
    "text-[#D1B797] bg-black/10 px-4! py-1! rounded-full font-normal ";

  const getClass = (path: string) =>
    location.pathname === path ? activeClass : " hover:text-white px-4!";

  // Automatically close mobile menu on route change

  // Lock background scroll when mobile menu is open
  // useEffect(() => {
  //   if (isOpen) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "hidden";
  //   }
  //   return () => {
  //     document.body.style.overflow = "hidden";
  //   };
  // }, [isOpen]);

  const navLinks = [
    { path: "/home", label: "Home" },
    { path: "/projects", label: "Projects" },
    { path: "/team", label: "Team" },
  ];

  return (
    <>
      {/* ========================================== */}
      {/* 1. DESKTOP NAVIGATION (>= 768px)          */}
      {/* ========================================== */}
      <nav className="hidden md:flex nav-links justify-center w-full items-center pt-4! gap-16 font-light text-white fixed top-0 left-0 z-50 ">
        <div className="glass-container-of-dev  backdrop-blur-md border border-white/20 shadow-lg   flex bg-gray-900/20  rounded-full justify-center items-center gap-8 text-white font-light px-2! py-2!">
          <Link to="/home" className={`${getClass("/home")} ${getClass("/")}`}>
            Home
          </Link>
          <Link to="/projects" className={getClass("/projects")}>
            Projects
          </Link>
          <Link to="/team" className={getClass("/team")}>
            Team
          </Link>
        </div>
      </nav>

      {/* ========================================== */}
      {/* 2. MOBILE NAVIGATION (< 768px)           */}
      {/* ========================================== */}
      <nav
        style={{ padding: "10px", justifyContent: "end" }}
        className=" md:hidden fixed w-full flex top-0 left-0   z-50  "
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation Menu"
          className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5  text-white focus:outline-none cursor-pointer"
        >
          <motion.span
            animate={
              isOpen
                ? { rotate: 45, y: 7.5, transitionDelay: 0.1 }
                : { rotate: 0, y: 0, transitionDelay: 0.1 }
            }
            className="w-6 h-0.5 bg-white block transition-transform"
          />
          <motion.span
            animate={
              isOpen
                ? { opacity: 0, transitionDelay: 0.1 }
                : { opacity: 1, transitionDelay: 0.1 }
            }
            className="w-6 h-0.5 bg-white block transition-opacity"
          />
          <motion.span
            animate={
              isOpen
                ? { rotate: -45, y: -7.5, transitionDelay: 0.1 }
                : { rotate: 0, y: 0, transitionDelay: 0.1 }
            }
            className="w-6 h-0.5 bg-white block transition-transform"
          />
        </button>
      </nav>

      {/* Mobile Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#0d0d0d] z-40 flex flex-col justify-center items-center px-8 md:hidden"
          >
            <div className="flex flex-col items-center gap-10">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1, duration: 0.4 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-3xl font-light tracking-widest ${
                      link.path === "/home"
                        ? location.pathname === "/home" ||
                          location.pathname === "/"
                          ? "text-[#D1B797] font-semibold"
                          : "text-white/80"
                        : location.pathname === link.path
                          ? "text-[#D1B797] font-semibold"
                          : "text-white/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer detail inside Mobile Menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-12 text-center text-xs text-white/40 tracking-widest uppercase font-mono"
            >
              General Contracting & Engineering
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
