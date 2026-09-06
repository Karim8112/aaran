import { useRef } from "react";
import HeroSection from "./Hero/Hero";
import "./home.css";
import GSAPScrollSequence from "./New/New";
import WhatWeDo from "./WhatWeDo/WhatWeDo";
import Clients from "./Clients/Clients";
import AboutUs from "./AboutUs/AboutUs";
import Chief from "./Chief/Chief";
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={containerRef} className="home">
        <HeroSection containerRef={containerRef} />

        <Clients />
      </div>
      <GSAPScrollSequence />
      <WhatWeDo />
      <AboutUs />
      <Chief />
    </>
  );
}
