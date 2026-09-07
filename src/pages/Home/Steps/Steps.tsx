import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis"; // Or '@studio-freight/lenis' depending on your package version
import "./steps.css";
// 1. Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 2. Define the TypeScript Interface for your data
interface ServiceData {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
}

// 3. Store your repeating data in an array
const servicesData: ServiceData[] = [
  {
    id: 1,
    title: "Web Development",
    description:
      "Creating high-performance websites with modern animation technologies and responsive designs.",
    imageSrc:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Brand Strategy",
    description:
      "Defining unique brand identities and strategic market positioning for modern businesses.",
    imageSrc:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "UI/UX Design",
    description:
      "Crafting intuitive and aesthetically pleasing user interfaces that elevate the overall product experience.",
    imageSrc:
      "https://images.unsplash.com/photo-1581291518655-9523c932dedf?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Motion Graphics",
    description:
      "Bringing designs to life with fluid motion, dynamic transitions, and cinematic storytelling elements.",
    imageSrc:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Digital Marketing",
    description:
      "Amplifying brand presence across multiple channels with data-driven creative campaigns.",
    imageSrc:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
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
                width: "70%",
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
    <div className="StepsContainer" ref={ContainerRef}>
      <section className="services">
        {/* Services Header */}
        <div className="services-header">
          <div className="header-col"></div>
          <div className="header-col">
            <h1>all services</h1>
          </div>
        </div>

        {/* Services List mapped dynamically */}
        <div className="services-list">
          {servicesData.map((service) => (
            <div className="service" key={service.id}>
              <div className="info-container">
                <h1>{service.title}</h1>
                <p>{service.description}</p>
              </div>

              <div className="image-container">
                <div className="image">
                  <img src={service.imageSrc} alt={service.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Services;
