import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import baseURL from "../../../public/baseURL";
// ==========================================
// 1. TYPES & CONFIGURATION
// ==========================================
export interface MemberData {
  id: number;
  title: string;
  tags: string;
  link: string;
  imageLeft?: string;
  imageRight?: string;
}

interface SlideObject {
  slideEl: HTMLDivElement;
  imgEl: HTMLImageElement;
  copyBlock: HTMLDivElement;
}

interface ColumnData {
  element: HTMLDivElement | null;
  visibleSlides: Map<number, SlideObject>;
}

const SETTINGS = {
  scrollSensitivity: 400, // Balanced sensitivity for trackpad/mouse
  smoothness: 0.1, // Smooth interpolation factor
  buffer: 2, // Slide buffer window
  imageShift: 120, // Parallax shift distance
  copyShift: 80, // Text drift distance
  titleHold: 0.15, // Stationary duration in center
  imageZoom: 1.18, // Image overscale factor
  revealOverlap: 0.5, // Seamless clip-path overlap
};

// ==========================================
// 2. HELPER CALCULATIONS
// ==========================================

// Correct 4-point rectangle polygon clip-paths (Fixes diagonal triangular cut bug)
function getRevealShape(revealAmount: number, isLeftColumn: boolean): string {
  const clamped = Math.max(0, Math.min(1, revealAmount));
  const percentage = clamped * (100 + SETTINGS.revealOverlap);

  if (isLeftColumn) {
    // Reveal from bottom upward
    return `polygon(0% ${100 - percentage}%, 100% ${100 - percentage}%, 100% 100%, 0% 100%)`;
  } else {
    // Reveal from top downward (Full rectangle bounds)
    return `polygon(0% 0%, 100% 0%, 100% ${percentage}%, 0% ${percentage}%)`;
  }
}

// Center snap & smoothstep curve
function getTitlePosition(progress: number): number {
  const distFromCenter = Math.abs(progress - 1);

  if (distFromCenter < SETTINGS.titleHold) {
    return 0;
  }

  const excess =
    (distFromCenter - SETTINGS.titleHold) / (1 - SETTINGS.titleHold);
  const clamped = Math.max(0, Math.min(1, excess));
  const smooth = clamped * clamped * (3 - 2 * clamped);

  return progress < 1 ? -smooth : smooth;
}

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function Team() {
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  // useRef persists animation targets across React re-renders
  const scrollPosition = useRef<number>(1);
  const scrollTarget = useRef<number>(1);
  const lastTouchY = useRef<number>(0);
  const animationFrameId = useRef<number>(0);

  const columns = useRef<{ left: ColumnData; right: ColumnData }>({
    left: { element: null, visibleSlides: new Map() },
    right: { element: null, visibleSlides: new Map() },
  });

  const [members, setMembers] = useState<MemberData[]>([]);
  useEffect(() => {
    // Note the leading slash: /teams.json points to the public folder root
    fetch("../../../public/team.json")
      .then((res) => res.json())
      .then((data) => setMembers(data));
  }, []);

  useEffect(() => {
    columns.current.left.element = leftColRef.current;
    columns.current.right.element = rightColRef.current;

    const createSlideNode = (index: number, columnKey: "left" | "right") => {
      // Bounded direct array lookup (1-based index)
      const data = members[index - 1];
      if (!data) return;
      const isLeft = columnKey === "left";
      const columnData = columns.current[columnKey];
      if (!columnData.element) return;

      const slideEl = document.createElement("div");
      slideEl.className =
        "absolute bg-[#999] inset-0 w-full h-full overflow-hidden [will-change:clip-path]";
      slideEl.style.zIndex = index.toString();

      const imgEl = document.createElement("img");
      imgEl.className =
        "absolute inset-0 w-full h-full object-cover [will-change:transform]";
      imgEl.src = isLeft ? data.imageLeft || "" : data.imageRight || "";
      imgEl.alt = data.title;

      const overlayEl = document.createElement("div");
      overlayEl.className =
        "absolute inset-0 w-full h-full bg-black/40 pointer-events-none";

      const copyBlock = document.createElement("div");
      copyBlock.className = `absolute top-1/2 -translate-y-1/2 w-screen flex flex-col items-center justify-center text-white pointer-events-none [will-change:transform] ${
        columnKey === "left" ? "left-0" : "right-0"
      }`;

      const tagsEl = document.createElement("div");
      tagsEl.className = `text-xs mb-4! sm:text-sm font-medium uppercase tracking-[0.2em] ${index % 2 == 0 ? "text-[#d1b797]" : "text-white"}  mb-3`;
      tagsEl.textContent = data.tags;

      const titleEl = document.createElement("h1");
      titleEl.className = `text-xl! mb-2! sm:text-2xl! md:text-6xl! ${index % 2 == 0 ? "text-white" : "text-[#d1b797]"} font-extrabold uppercase tracking-tight text-center leading-tight`;
      titleEl.textContent = data.title;

      const linkEl = document.createElement("a");
      linkEl.className =
        "text-xs sm:text-sm tracking-widest! font-semibold mt-4 text-white border-b border-white/60 hover:border-white pointer-events-auto transition-opacity duration-300 hover:opacity-80";
      linkEl.href = `${baseURL.concat("team/").concat(String(data.id))}`;
      linkEl.textContent = "View Profile";

      copyBlock.appendChild(tagsEl);
      copyBlock.appendChild(titleEl);
      copyBlock.appendChild(linkEl);

      slideEl.appendChild(imgEl);
      slideEl.appendChild(overlayEl);
      slideEl.appendChild(copyBlock);

      columnData.element.appendChild(slideEl);
      columnData.visibleSlides.set(index, { slideEl, imgEl, copyBlock });
    };

    const updateSlider = () => {
      // Bounded first and last indices (Bounded between 1 and TEAM_SLIDES.length)
      const firstIndex = Math.max(
        1,
        Math.floor(scrollPosition.current) - SETTINGS.buffer,
      );
      const lastIndex = Math.min(
        members.length,
        Math.ceil(scrollPosition.current) + SETTINGS.buffer,
      );

      (Object.keys(columns.current) as Array<"left" | "right">).forEach(
        (columnKey) => {
          const isLeft = columnKey === "left";
          const columnData = columns.current[columnKey];

          // 1. Instantiate missing bounded slides
          for (let i = firstIndex; i <= lastIndex; i++) {
            if (!columnData.visibleSlides.has(i)) {
              createSlideNode(i, columnKey);
            }
          }

          // 2. Animate and prune slides
          columnData.visibleSlides.forEach((slideObj, index) => {
            if (index < firstIndex || index > lastIndex) {
              slideObj.slideEl.remove();
              columnData.visibleSlides.delete(index);
            } else {
              const revealAmount = scrollPosition.current - (index - 1);
              const progress = Math.max(0, Math.min(2, revealAmount));

              // Correct non-triangular clip-path wipe
              slideObj.slideEl.style.clipPath = getRevealShape(
                revealAmount,
                isLeft,
              );

              // Parallax image drift
              const driftDir = isLeft ? 1 : -1;
              const imgY = (1 - progress) * SETTINGS.imageShift * driftDir;
              gsap.set(slideObj.imgEl, {
                y: imgY,
                scale: SETTINGS.imageZoom,
              });

              // Title position snapping
              const copyY = getTitlePosition(progress) * SETTINGS.copyShift;
              gsap.set(slideObj.copyBlock, {
                y: copyY,
              });
            }
          });
        },
      );
    };

    const renderLoop = () => {
      // Linear interpolation toward scrollTarget
      scrollPosition.current +=
        (scrollTarget.current - scrollPosition.current) * SETTINGS.smoothness;

      updateSlider();
      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    // Clamped Wheel Event Handler (Prevents trackpad momentum jumping)
    const handleWheel = (e: WheelEvent) => {
      const clampedDelta = Math.max(-80, Math.min(80, e.deltaY));
      const step = clampedDelta / SETTINGS.scrollSensitivity;

      scrollTarget.current = Math.max(
        1,
        Math.min(members.length, scrollTarget.current + step),
      );
    };

    // Clamped Touch Event Handler
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY.current - currentY;
      lastTouchY.current = currentY;

      const clampedDelta = Math.max(-60, Math.min(60, deltaY));
      const step = (clampedDelta * 1.5) / SETTINGS.scrollSensitivity;

      scrollTarget.current = Math.max(
        1,
        Math.min(members.length, scrollTarget.current + step),
      );
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);

      Object.values(columns.current).forEach((col) => {
        col.visibleSlides.forEach((obj) => obj.slideEl.remove());
        col.visibleSlides.clear();
      });
    };
  }, [members]);

  return (
    <section className="fixed inset-0 w-screen h-screen flex flex-row overflow-hidden bg-[#0d0d0d] select-none">
      {/* Left Column Half */}
      <div
        ref={leftColRef}
        className="relative flex-1 h-full overflow-hidden"
      />

      {/* Right Column Half */}
      <div
        ref={rightColRef}
        className="relative flex-1 h-full overflow-hidden"
      />
    </section>
  );
}
