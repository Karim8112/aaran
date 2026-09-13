import  { useEffect, useRef } from "react";
import gsap from "gsap";

// ==========================================
// 1. TYPES & DATA CONFIGURATION
// ==========================================
interface SlideData {
  title: string;
  tags: string;
  color: string;
  link: string;
  image: string;
}

interface SlideElements {
  slideEl: HTMLDivElement;
  imgEl: HTMLImageElement;
  copyBlock: HTMLDivElement;
}

const SETTINGS = {
  scrollSensitivity: 1500, // Scroll distance required per slide
  smoothness: 0.08, // Weighted easing factor
  buffer: 2, // Number of off-screen slides maintained
  imageShift: 120, // Parallax image drift distance
  copyShift: 80, // Text drift distance
  titleHold: 0.15, // Duration title holds still in center
  imageZoom: 1.18, // Image overscale factor for parallax
  revealOverlap: 0.5, // Prevents seam gaps during clip-path wipes
};

const SLIDES: SlideData[] = [
  {
    title: "Glitch & Grit",
    tags: "Web Design / Interactive",
    color: "#ff3366",
    link: "#",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Monolithic Void",
    tags: "Architecture / Brutalism",
    color: "#d1b797",
    link: "#",
    image:
      "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Chromatic Drift",
    tags: "3D Motion / Concept",
    color: "#00f0ff",
    link: "#",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Lumina Studio",
    tags: "Brand Identity / Strategy",
    color: "#e2ff00",
    link: "#",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  },
];

// ==========================================
// 2. MATH & SHAPE HELPER FUNCTIONS
// ==========================================

// Positive Modulo Wrapping for Infinite Looping
function getWrappedIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}

// Clip Path Polygon Generator for Split Reveals
function getRevealShape(revealAmount: number, isLeftColumn: boolean): string {
  const clamped = Math.max(0, Math.min(1, revealAmount));
  const percentage = clamped * (100 + SETTINGS.revealOverlap);

  if (isLeftColumn) {
    // Opens from bottom edge upward
    return `polygon(0% ${100 - percentage}%, 100% ${100 - percentage}%, 100% 100%, 0% 100%)`;
  } else {
    // Opens from top edge downward
    return `polygon(0% 0%, 100% 0%, 100% ${percentage}%, 0% 0%)`;
  }
}

// Center Snap and Smoothstep Curve for Title Motion
function getTitlePosition(progress: number): number {
  const distFromCenter = Math.abs(progress - 1);
  if (distFromCenter < SETTINGS.titleHold) {
    return 0; // Holds stationary in center
  }
  const excess =
    (distFromCenter - SETTINGS.titleHold) / (1 - SETTINGS.titleHold);
  const clamped = Math.max(0, Math.min(1, excess));
  const smooth = clamped * clamped * (3 - 2 * clamped);
  return progress < 1 ? -smooth : smooth;
}

// ==========================================
// 3. MAIN REACT COMPONENT
// ==========================================
export default function SplitSlider() {
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let scrollPosition = 1;
    let scrollTarget = 1;
    let lastTouchY = 0;
    let animationFrameId: number;

    const visibleSlidesLeft = new Map<number, SlideElements>();
    const visibleSlidesRight = new Map<number, SlideElements>();

    const createSlide = (index: number, columnKey: "left" | "right") => {
      const parentEl =
        columnKey === "left" ? leftColRef.current : rightColRef.current;
      if (!parentEl) return;

      const slideMap =
        columnKey === "left" ? visibleSlidesLeft : visibleSlidesRight;
      const dataIndex = getWrappedIndex(index, SLIDES.length);
      const data = SLIDES[dataIndex];
      const isLeft = columnKey === "left";

      // Outer Slide Container
      const slideEl = document.createElement("div");
      slideEl.className =
        "absolute top-0 left-0 w-full h-full overflow-hidden [will-change:clip-path]";
      slideEl.style.zIndex = index.toString();

      // Background Image
      const imgEl = document.createElement("img");
      imgEl.className =
        "absolute top-0 left-0 w-full h-full object-cover [will-change:transform]";
      imgEl.src = data.image;
      imgEl.alt = data.title;

      // Dark Overlay
      const overlayEl = document.createElement("div");
      overlayEl.className =
        "absolute top-0 left-0 w-full h-full bg-black/35 pointer-events-none";

      // Full Viewport Text Copy Block
      const copyBlock = document.createElement("div");
      copyBlock.className = `absolute top-1/2 -translate-y-1/2 w-[100vw] flex flex-col items-center justify-center text-white pointer-events-none [will-change:transform] ${
        isLeft ? "left-0" : "right-0"
      }`;

      const tagsEl = document.createElement("div");
      tagsEl.className =
        "text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] mb-3 opacity-80";
      tagsEl.textContent = data.tags;

      const titleEl = document.createElement("h1");
      titleEl.className =
        "text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-center leading-none";
      titleEl.style.color = data.color;
      titleEl.textContent = data.title;

      const linkEl = document.createElement("a");
      linkEl.className =
        "text-xs sm:text-sm font-semibold mt-4 text-white underline underline-offset-4 pointer-events-auto hover:opacity-70 transition-opacity";
      linkEl.href = data.link;
      linkEl.textContent = "Explore Project";

      copyBlock.appendChild(tagsEl);
      copyBlock.appendChild(titleEl);
      copyBlock.appendChild(linkEl);

      slideEl.appendChild(imgEl);
      slideEl.appendChild(overlayEl);
      slideEl.appendChild(copyBlock);

      parentEl.appendChild(slideEl);
      slideMap.set(index, { slideEl, imgEl, copyBlock });
    };

    const updateSlider = () => {
      const firstIndex = Math.floor(scrollPosition) - SETTINGS.buffer;
      const lastIndex = Math.ceil(scrollPosition) + SETTINGS.buffer;

      (["left", "right"] as const).forEach((columnKey) => {
        const isLeft = columnKey === "left";
        const slideMap = isLeft ? visibleSlidesLeft : visibleSlidesRight;

        // Pass 1: Create slides in range
        for (let i = firstIndex; i <= lastIndex; i++) {
          if (!slideMap.has(i)) {
            createSlide(i, columnKey);
          }
        }

        // Pass 2: Animate or remove out-of-range slides
        slideMap.forEach((slideObj, index) => {
          if (index < firstIndex || index > lastIndex) {
            slideObj.slideEl.remove();
            slideMap.delete(index);
          } else {
            const revealAmount = scrollPosition - (index - 1);
            const progress = Math.max(0, Math.min(2, revealAmount));

            slideObj.slideEl.style.clipPath = getRevealShape(
              revealAmount,
              isLeft,
            );

            const driftDir = isLeft ? 1 : -1;
            const imgY = (1 - progress) * SETTINGS.imageShift * driftDir;
            gsap.set(slideObj.imgEl, {
              y: imgY,
              scale: SETTINGS.imageZoom,
            });

            const copyY = getTitlePosition(progress) * SETTINGS.copyShift;
            gsap.set(slideObj.copyBlock, {
              y: copyY,
            });
          }
        });
      });
    };

    const animateSlider = () => {
      scrollPosition += (scrollTarget - scrollPosition) * SETTINGS.smoothness;
      updateSlider();
      animationFrameId = requestAnimationFrame(animateSlider);
    };

    const handleWheel = (e: WheelEvent) => {
      scrollTarget += e.deltaY / SETTINGS.scrollSensitivity;
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentY;
      lastTouchY = currentY;
      scrollTarget += (deltaY * 2.5) / SETTINGS.scrollSensitivity;
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    animateSlider();

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);

      visibleSlidesLeft.forEach((obj) => obj.slideEl.remove());
      visibleSlidesRight.forEach((obj) => obj.slideEl.remove());
      visibleSlidesLeft.clear();
      visibleSlidesRight.clear();
    };
  }, []);

  return (
    <section className="fixed inset-0 w-screen h-screen flex flex-row overflow-hidden bg-black text-white select-none">
      {/* Left Column (50% Width) */}
      <div
        ref={leftColRef}
        className="flex-1 h-full relative overflow-hidden"
      />
      {/* Right Column (50% Width) */}
      <div
        ref={rightColRef}
        className="flex-1 h-full relative overflow-hidden"
      />
    </section>
  );
}
