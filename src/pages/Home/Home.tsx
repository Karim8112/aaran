import { useRef } from "react";
import HeroSection from "./Hero/Hero";
import "./home.css";
import GSAPScrollSequence from "../New/New";
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={containerRef} className="home">
        <HeroSection containerRef={containerRef} />

        <section className="studio">
          <h1>STUDIO</h1>
        </section>
      </div>
      <GSAPScrollSequence />
      <div className="outro w-screen h-screen bg-gray-800">test</div>
    </>
  );
}
