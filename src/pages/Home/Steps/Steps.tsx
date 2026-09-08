import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis"; // Or '@studio-freight/lenis' depending on your package version
import "./steps.css";
// 1. Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
import { IconSparkle2 } from "@tabler/icons-react";

// 2. Define the TypeScript Interface for your data
interface ServiceData {
  id: number;
  title: string;
  description: string[];
  imageSrc: string;
}

// 3. Store your repeating data in an array
const servicesData: ServiceData[] = [
  {
    id: 1,
    title: "Site Preparation",
    description: [
      "Site equipping & locating offices.",
      "Storage, water supply & electricity.",
      "Access, exit & emergency provisions.",
    ],
    imageSrc:
      "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Time plan organization",
    description: [
      "Logical scheduling compatible with task chronology.",
      "Schedule matching specified quantities.",
    ],
    imageSrc:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Necessary experience",
    description: [
      "Securing highly skilled specialized technical expertise.",
      "Previous experience in similar heritage projects.",
    ],
    imageSrc:
      "https://images.unsplash.com/photo-1694521787193-9293daeddbaa?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    title: "Tools & equipment",
    description: ["Determination of number, use, timing & maintenance."],
    imageSrc:
      "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?q=80&w=1179&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const Services: React.FC = () => {
  const ContainerRef = useRef<HTMLDivElement | null>(null);
  // 4. Initialize Lenis and GSAP Ticker in useEffect
  useEffect(() => {
    // ==========================================
    // 1. INITIALIZE LENIS
    // ==========================================
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1,
      wheelMultiplier: 1,
      infinite: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    let observer: IntersectionObserver;

    // ==========================================
    // 2. GSAP CONTEXT & OBSERVER LOGIC
    // ==========================================
    // gsap.context() automatically cleans up all GSAP animations created inside it
    const ctx = gsap.context(() => {
      const services = gsap.utils.toArray<HTMLElement>(".service");

      const observerOptions = {
        root: null,
        threshold: 0.1,
      };

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const serviceElement = entry.target as HTMLElement;
            const imageContainer =
              serviceElement.querySelector(".image-container");

            // Animate Image Container Width
            if (imageContainer) {
              gsap.to(imageContainer, {
                width: "55%",
                ease: "none",
                scrollTrigger: {
                  trigger: serviceElement,
                  start: "top 80%",
                  end: "bottom 20%",
                  scrub: true,
                },
              });
            }

            // Animate Service Element Height
            if (window.innerWidth >= 768) {
              gsap.to(serviceElement, {
                height: "500px",
                ease: "none",
                scrollTrigger: {
                  trigger: serviceElement,
                  start: "top 80%",
                  end: "bottom 20%",
                  scrub: true,
                },
              });
            }

            // Stop observing once triggered
            observer.unobserve(serviceElement);
          }
        });
      };

      observer = new IntersectionObserver(observerCallback, observerOptions);

      // Start observing each service
      services.forEach((service) => {
        observer.observe(service);
      });
    }, ContainerRef); // Scope the context to this component's DOM

    // ==========================================
    // 3. CLEANUP FUNCTION (Crucial for React)
    // ==========================================
    return () => {
      lenis.destroy(); // Destroy smooth scrolling
      gsap.ticker.remove(raf); // Remove requestAnimationFrame
      ctx.revert(); // Revert all GSAP animations and kill ScrollTriggers
      if (observer) observer.disconnect(); // Disconnect IntersectionObserver
    };
  }, []); // Empty dependency array ensures this runs only once
  return (
    <section className="StepsContainer" ref={ContainerRef}>
      {/* Services Header */}

      <div className="header-col  mx-12.5! py-8!  border-b-2 border-[white]/10">
        <span className="text-xl! font-sans font-semibold tracking-widest! uppercase text-white">
          capability statement
        </span>
      </div>

      {/* Services List mapped dynamically */}
      <div className="services-list flex flex-col px-25!">
        {servicesData.map((service) => (
          <div className="service" key={service.id}>
            {/* the title */}
            <div className=" flex flex-col w-full md:w-[40%] gap-5 h-full justify-center">
              <h1 className="text-[#d1b797]  tracking-wider! font-bold! text-4xl!">
                {service.title}
              </h1>
              {service.description.map((desc) => {
                return (
                  <div className=" flex gap-4">
                    <IconSparkle2 stroke={2} color="#FFFFFF60" />
                    <p className="text-white text-[15px] sm:text-[16px] md:text-[18px] lg:text-[19px] font-light tracking-wide">
                      {desc}
                    </p>
                    {""}
                  </div>
                );
              })}
            </div>
            {/* the image */}
            <div className="image-container md:block! hidden rounded-sm">
              <div className="image">
                <img src={service.imageSrc} alt={service.title} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
