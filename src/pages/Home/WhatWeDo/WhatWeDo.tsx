import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import type { IWhatWeDo } from "../../../Model/Landing";

// Register ScrollTrigger globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Slide Interface

export default function SmoothScrollSlider({
  data,
}: {
  data: IWhatWeDo[] | [];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const activeSlideRef = useRef(0);

  // Custom text splitter matching GSAP's Premium SplitText for free [16]
  const splitTextAndAnimate = (text: string) => {
    const container = textContainerRef.current;
    if (!container) return;

    container.innerHTML = "";
    const lines = text.split("\n");

    lines.forEach((lineText) => {
      const wrapper = document.createElement("div");
      wrapper.className = "line-wrapper";
      wrapper.style.overflow = "hidden";
      wrapper.style.marginBottom = "0.25rem";

      const innerSpan = document.createElement("span");
      innerSpan.className = "line-inner";
      innerSpan.textContent = lineText;
      innerSpan.style.display = "inline-block";

      // Starting absolute state
      gsap.set(innerSpan, { yPercent: 105 });

      wrapper.appendChild(innerSpan);
      container.appendChild(wrapper);
    });

    const targetSpans = container.querySelectorAll(".line-inner");
    gsap.to(targetSpans, {
      yPercent: 0,
      duration: 0.4,
      ease: "power3.out",
      stagger: 0.1,
    });
  };

  // Triggers background image crossfades and text animations [12, 13]
  const animateNewSlide = (index: number) => {
    const container = imagesContainerRef.current;
    if (!container) return;

    const nextImg = document.createElement("img");
    nextImg.src = data[index].image;
    nextImg.alt = `Spotlight Slide ${index + 1}`;
    nextImg.style.position = "absolute";
    nextImg.style.top = "0";
    nextImg.style.left = "0";
    nextImg.style.width = "100%";
    nextImg.style.height = "100%";
    nextImg.style.objectFit = "cover";

    // Scaled zoom transition initialization [13]
    gsap.set(nextImg, { opacity: 0, scale: 1.15 });
    container.appendChild(nextImg);

    gsap.to(nextImg, {
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: "power2.out",
    });

    // Clean old images to maintain a clean rendering footprint [13]
    const currentImgs = container.querySelectorAll("img");
    if (currentImgs.length > 3) {
      currentImgs[0].remove();
    }

    // Trigger text split
    if (data[index]) splitTextAndAnimate(data[index].text);
  };

  useEffect(() => {
    // 1. Initialize Smooth Scrolling [9]
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

    // 2. Setup Context bound to this container [10]
    const ctx = gsap.context(() => {
      // Set initial state
      animateNewSlide(0);

      // Pin slider layout and connect transitions to scroll progression [17]
      ScrollTrigger.create({
        trigger: ".slider-section",
        start: "top top",
        end: () => `+=${window.innerHeight * data.length}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Update side indicator progress bar
          if (progressRef.current) {
            const isMobile = window.innerWidth < 768;
            gsap.set(progressRef.current, {
              [isMobile ? "scaleX" : "scaleY"]: progress,
            });
          }

          // Fetch discrete active page step
          const targetIndex = Math.min(
            Math.floor(progress * data.length),
            data.length - 1,
          );

          if (targetIndex !== activeSlideRef.current) {
            activeSlideRef.current = targetIndex;
            setActiveSlide(targetIndex);
            animateNewSlide(targetIndex);
          }
        },
      });
    }, containerRef);

    // 3. Clear resources on route transitions (Prevents memory leaks!)
    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#0b0b0b] text-white overflow-hidden"
    >
      {/* Navbar Overlay */}
      <nav className="fixed top-0 left-0 w-full p-10 flex justify-between items-center z-[100] font-mono text-[0.8rem] tracking-[0.1em]"></nav>

      {/* Dynamic Scroll Sequence */}
      <section className="slider-section w-full h-screen relative overflow-hidden">
        <div className="w-full h-full relative">
          {/* Backing images container */}
          <div ref={imagesContainerRef} className="absolute inset-0 z-1" />

          {/* Low brightness contrast grid overlay */}
          <div className="absolute inset-0! bg-[radial-gradient(circle,transparent_20%,rgba(0,0,0,0.85)_100%)]! z-10 pointer-events-none" />

          {/* Text text Content */}
          <div className="absolute top-[50%] left-[10%] -translate-y-[50%] w-[85%] md:w-[60%] z-10 pointer-events-none">
            <h1
              ref={textContainerRef}
              className="text-2xl md:text-[3.5rem] font-medium leading-[1.1] tracking-tighter "
            />
          </div>

          {/* Right Floating HUD Indices */}
          <div className="absolute top-[50%] right-[6%] -translate-y-[50%] flex items-center gap-10 z-10 max-md:right-auto max-md:left-[5%] max-md:bottom-[10%] max-md:top-auto max-md:translate-y-0 max-md:flex-row-reverse max-md:justify-end max-md:w-[90%]">
            <div className="flex flex-col gap-6 max-md:flex-row max-md:gap-4">
              {data.map((_, index) => {
                const formattedNum = String(index + 1).padStart(2, "0");
                const isActive = index === activeSlide;
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-end gap-4 font-mono text-[20px] ${
                      isActive ? "text-[#c5a379]" : "text-white"
                    }`}
                  >
                    <span
                      className="w-[25px] h-[1.5px] origin-right bg-current transition-transform duration-500 will-change-transform max-md:hidden"
                      style={{
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      }}
                    />
                    <span
                      className="transition-opacity duration-500 will-change-opacity"
                      style={{ opacity: isActive ? 1 : 0.3 }}
                    >
                      {formattedNum}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Continuous Side progress bar tracker */}
            <div className="w-[1.5px] height-[180px] bg-white/15 relative overflow-hidden max-md:w-[100px] max-md:h-[1.5px]">
              <div
                ref={progressRef}
                className="absolute inset-0 bg-[#d1b797] origin-top will-change-transform max-md:origin-left"
                style={{ transform: "scaleY(0)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Outro */}
    </div>
  );
}
