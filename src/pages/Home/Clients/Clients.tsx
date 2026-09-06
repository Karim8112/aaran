import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./parallax.css";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Define the 8 images (4 for the left columns, 4 for the right columns)
const IMAGES = [
  // Left Side - Column 1 (Outer Left)
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=600&q=80",

  // Left Side - Column 2 (Inner Left)
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",

  // Right Side - Column 3 (Inner Right)
  "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80",

  // Right Side - Column 4 (Outer Right)
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
];

export default function Clients() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Create local refs for each column (4 columns total)
  const columnsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // 1. Initialize Lenis for buttery smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // 2. Set up the GSAP Parallax Animation
    const ctx = gsap.context(() => {
      // Configuration for vertical travel distances
      // Outer columns travel faster, inner columns travel slower to create depth
      const parallaxConfig = [
        { speed: -180 }, // Column 1 (Outer Left): moves quickly upward
        { speed: -80 }, // Column 2 (Inner Left): moves slowly upward
        { speed: -100 }, // Column 3 (Inner Right): moves moderately upward
        { speed: -220 }, // Column 4 (Outer Right): moves very quickly upward
      ];

      // Initial offsets to scatter the layout before scrolling starts
      const initialOffsets = [150, 60, 90, 200]; // Pushes columns down

      columnsRef.current.forEach((col, index) => {
        if (!col) return;

        const config = parallaxConfig[index];
        const offset = initialOffsets[index];

        // Apply starting position offsets
        gsap.set(col, { y: offset });

        // Animate each column on scroll
        gsap.to(col, {
          y: `-=${offset - config.speed}`, // Animate past their offset based on speed
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom", // Starts as soon as the section enters the screen
            end: "bottom top", // Ends when the section fully leaves the screen
            scrub: true,
          },
        });
      });
    }, containerRef);

    // Clean up animation contexts & ticker events to prevent memory leaks
    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="parallax-section-wrapper">
      {/* Centered Static Headline that remains fixed while images float around it */}
      <div className="parallax-center-header">
        <h2>Aaran.</h2>
        <p>Architecting Spaces, Crafting Experiences</p>
      </div>

      {/* Grid containing the symmetric floating columns */}
      <div className="parallax-images-grid">
        {/* LEFT SIDE (Columns 1 & 2) */}
        <div className="parallax-side left-side">
          {/* Column 1: Outer Left */}
          <div
            ref={(el) => {
              if (el) columnsRef.current[0] = el;
            }}
            className="parallax-column col-outer"
          >
            <div className="img-wrapper">
              <img src={IMAGES[0]} alt="Work 1" />
            </div>
            <div className="img-wrapper">
              <img src={IMAGES[1]} alt="Work 2" />
            </div>
          </div>

          {/* Column 2: Inner Left */}
          <div
            ref={(el) => {
              if (el) columnsRef.current[1] = el;
            }}
            className="parallax-column col-inner"
          >
            <div className="img-wrapper">
              <img src={IMAGES[2]} alt="Work 3" />
            </div>
            <div className="img-wrapper">
              <img src={IMAGES[3]} alt="Work 4" />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Columns 3 & 4) */}
        <div className="parallax-side right-side">
          {/* Column 3: Inner Right */}
          <div
            ref={(el) => {
              if (el) columnsRef.current[2] = el;
            }}
            className="parallax-column col-inner"
          >
            <div className="img-wrapper">
              <img src={IMAGES[4]} alt="Work 5" />
            </div>
            <div className="img-wrapper">
              <img src={IMAGES[5]} alt="Work 6" />
            </div>
          </div>

          {/* Column 4: Outer Right */}
          <div
            ref={(el) => {
              if (el) columnsRef.current[3] = el;
            }}
            className="parallax-column col-outer"
          >
            <div className="img-wrapper">
              <img src={IMAGES[6]} alt="Work 7" />
            </div>
            <div className="img-wrapper">
              <img src={IMAGES[7]} alt="Work 8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
