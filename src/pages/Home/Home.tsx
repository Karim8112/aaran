import { useEffect, useRef } from "react";
import HeroSection from "./Hero/Hero";
import "./home.css";
import GSAPScrollSequence from "./New/New";
import WhatWeDo from "./WhatWeDo/WhatWeDo";
import Clients from "./Clients/Clients";
import AboutUs from "./AboutUs/AboutUs";
import Chief from "./Chief/Chief";
import Steps from "./Steps/Steps";
import Contact from "./Contact/Contact";
import { useLanding } from "./useLanding";
import LoadingScreen from "../Loading";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const Landing = useLanding();

  useEffect(() => {
    Landing.getData();
  }, []);

  console.log("this is data inside home", Landing.data);

  return (
    <>
      {Landing.loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div ref={containerRef} className="home">
            <HeroSection
              containerRef={containerRef}
              data={Landing?.data?.data.hero[0] ?? null}
            />
            <Clients />
          </div>
          <GSAPScrollSequence />
          <WhatWeDo data={Landing?.data?.data.whatWeDo ?? []} />
          <AboutUs data={Landing?.data?.data.aboutUs[0] ?? null} />
          <Chief />
          <Steps data={Landing?.data?.data.list ?? []} />
          <Contact />
        </>
      )}
    </>
  );
}
