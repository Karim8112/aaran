import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./parallax.css";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import iamge1 from "../../../assets/gopa.png";
import iamge2 from "../../../assets/icrc.png";
import iamge3 from "../../../assets/unicef.png";
import iamge4 from "../../../assets/khan.png";
import iamge5 from "../../../assets/nrc.png";
import iamge6 from "../../../assets/pui.png";
import iamge7 from "../../../assets/sif.png";
import iamge8 from "../../../assets/undp.png";

// Define the 8 images (one for each of the 8 staggered columns)
const IMAGES = [
  // Left Side Columns (1 to 4)
  iamge1,
  iamge2,
  iamge3,
  iamge4,

  // Right Side Columns (5 to 8)
  iamge5,
  iamge6,
  iamge7,
  iamge8,
];

export default function Clients() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Create local refs for each of the 8 columns
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
      // Configuration for vertical travel speeds across all 8 columns to create maximum organic depth
      const parallaxConfig = [
        { speed: -180 }, // Column 1 (Far Left)
        { speed: -80 }, // Column 2
        { speed: -140 }, // Column 3
        { speed: -60 }, // Column 4 (Inner Left)
        { speed: -100 }, // Column 5 (Inner Right)
        { speed: -200 }, // Column 6
        { speed: -120 }, // Column 7
        { speed: -240 }, // Column 8 (Far Right)
      ];

      // Starting offsets to stagger the elements vertically on initial paint
      const initialOffsets = [150, 40, 220, 80, 110, 260, 60, 180];

      columnsRef.current.forEach((col, index) => {
        if (!col) return;

        const config = parallaxConfig[index];
        const offset = initialOffsets[index];

        // Apply starting staggered position offsets
        gsap.set(col, { y: offset });

        // Animate each column dynamically based on scroll delta
        gsap.to(col, {
          y: `-=${offset - config.speed}`,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom", // Starts when section enters viewport from bottom
            end: "bottom top", // Ends when section fully exits viewport to top
            scrub: true,
          },
        });
      });
    }, containerRef);

    // Cleanup ticker events & contexts on unmount to completely eliminate memory leaks
    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="parallax-section-wrapper">
      {/* Centered Static Headline: anchor-locked inside this relative section */}
      <div className="parallax-center-header">
        <h1>Clients</h1>
        <p>That trust us with their most important projects</p>
      </div>

      {/* Grid containing the 8 symmetric floating columns */}
      <div className="parallax-images-grid">
        {/* LEFT SIDE (Columns 1 to 4) */}
        <div className="parallax-side left-side">
          {/* Column 1 */}
          <div
            ref={(el) => {
              if (el) columnsRef.current[0] = el;
            }}
            className="parallax-column"
          >
            <div className="img-wrapper">
              <img src={IMAGES[0]} alt="Work 1" />
            </div>
          </div>

          {/* Column 2 */}
          <div
            ref={(el) => {
              if (el) columnsRef.current[1] = el;
            }}
            className="parallax-column"
          >
            <div className="img-wrapper">
              <img src={IMAGES[1]} alt="Work 2" />
            </div>
          </div>

          {/* Column 3 */}
          <div
            ref={(el) => {
              if (el) columnsRef.current[2] = el;
            }}
            className="parallax-column"
          >
            <div className="img-wrapper">
              <img src={IMAGES[2]} alt="Work 3" />
            </div>
          </div>

          {/* Column 4 */}
          <div
            ref={(el) => {
              if (el) columnsRef.current[3] = el;
            }}
            className="parallax-column"
          >
            <div className="img-wrapper">
              <img src={IMAGES[3]} alt="Work 4" />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Columns 5 to 8) */}
        <div className="parallax-side right-side">
          {/* Column 5 */}
          <div
            ref={(el) => {
              if (el) columnsRef.current[4] = el;
            }}
            className="parallax-column"
          >
            <div className="img-wrapper">
              <img src={IMAGES[4]} alt="Work 5" />
            </div>
          </div>

          {/* Column 6 */}
          <div
            ref={(el) => {
              if (el) columnsRef.current[5] = el;
            }}
            className="parallax-column"
          >
            <div className="img-wrapper">
              <img src={IMAGES[5]} alt="Work 6" />
            </div>
          </div>

          {/* Column 7 */}
          <div
            ref={(el) => {
              if (el) columnsRef.current[6] = el;
            }}
            className="parallax-column"
          >
            <div className="img-wrapper">
              <img src={IMAGES[6]} alt="Work 7" />
            </div>
          </div>

          {/* Column 8 */}
          <div
            ref={(el) => {
              if (el) columnsRef.current[7] = el;
            }}
            className="parallax-column"
          >
            <div className="img-wrapper">
              <img src={IMAGES[7]} alt="Work 8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
