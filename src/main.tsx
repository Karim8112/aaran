import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.tsx";
import Navbar from "./Nav.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TransitionProvider from "./TransitionProvider.tsx";
import Home from "./Home.tsx";
import Projects from "./Projects.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TransitionProvider>
        <div className="container relative">
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </TransitionProvider>
    </BrowserRouter>
  </StrictMode>,
);
