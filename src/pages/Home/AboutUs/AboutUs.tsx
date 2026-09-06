import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PARAGRAPHS = [
  "We design spaces that breathe, move, and tell your unique architectural story.",
  "Every blueprint is a commitment to engineering precision and sustainable innovation.",
  "From conception to final brick, we craft luxury contracting solutions for tomorrow.",
];

export default function AboutUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedInnerRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pinnedInnerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Grab our split word elements securely within the context
      const b1 = gsap.utils.toArray(".block-0") as HTMLElement[];
      const b2 = gsap.utils.toArray(".block-1") as HTMLElement[];
      const b3 = gsap.utils.toArray(".block-2") as HTMLElement[];

      // Initial state: push incoming paragraphs out of view vertically
      gsap.set(b2, { yPercent: 105 });
      gsap.set(b3, { yPercent: 105 });

      const OVERLAP_COUNT = 3.5;

      // Staggered word animation calculations (cloned from Codegrid's math)
      const getWordProgress = (
        phaseProgress: number,
        wordIndex: number,
        totalWords: number,
      ) => {
        const totalLength = 1 + OVERLAP_COUNT / totalWords;
        const scale = 1 / totalLength;

        const startTime = (wordIndex / totalWords) * scale;
        const endTime = startTime + (OVERLAP_COUNT / totalWords) * scale;
        const duration = endTime - startTime;

        if (phaseProgress < startTime) return 0;
        if (phaseProgress > endTime) return 1;
        return (phaseProgress - startTime) / duration;
      };

      const animateBlock = (
        outgoing: HTMLElement[],
        incoming: HTMLElement[],
        progress: number,
      ) => {
        outgoing.forEach((word, idx) => {
          const prog = getWordProgress(progress, idx, outgoing.length);
          gsap.set(word, { yPercent: -prog * 105 });
        });

        incoming.forEach((word, idx) => {
          const prog = getWordProgress(progress, idx, incoming.length);
          gsap.set(word, { yPercent: (1 - prog) * 105 });
        });
      };

      // 2. The Native GSAP Pinning Sequence
      ScrollTrigger.create({
        trigger: containerRef.current, // The tall scrollable container (300vh)
        pin: pinnedInnerRef.current, // 👈 PIN this inner container inside the viewport!
        start: "top top",
        end: "bottom bottom",
        pinSpacing: true, // 👈 Automatically reserves page height for next sections
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Update the top progress bar
          if (progressFillRef.current) {
            gsap.set(progressFillRef.current, { scaleX: progress });
          }

          // Gather paragraph containers to cleanly toggle visibility and avoid overlapping
          const c1 = document.querySelector(".p-container-0") as HTMLElement;
          const c2 = document.querySelector(".p-container-1") as HTMLElement;
          const c3 = document.querySelector(".p-container-2") as HTMLElement;

          if (progress <= 0.5) {
            // First Half: Transition Paragraph 1 -> Paragraph 2
            if (c1) {
              c1.style.visibility = "visible";
              c1.style.opacity = "1";
            }
            if (c2) {
              c2.style.visibility = "visible";
              c2.style.opacity = "1";
            }
            if (c3) {
              c3.style.visibility = "hidden";
              c3.style.opacity = "0";
            }

            const phase1Progress = progress / 0.5;
            animateBlock(b1, b2, phase1Progress);
          } else {
            // Second Half: Transition Paragraph 2 -> Paragraph 3
            if (c1) {
              c1.style.visibility = "hidden";
              c1.style.opacity = "0";
            }
            if (c2) {
              c2.style.visibility = "visible";
              c2.style.opacity = "1";
            }
            if (c3) {
              c3.style.visibility = "visible";
              c3.style.opacity = "1";
            }

            const phase2Progress = (progress - 0.5) / 0.5;
            animateBlock(b2, b3, phase2Progress);
          }
        },
      });
    }, containerRef);

    return () => ctx.revert(); // Safe memory cleanup
  }, []);

  // Split sentence helper
  const renderSplitParagraph = (text: string, blockIndex: number) => {
    return text.split(" ").map((word, wordIndex) => (
      <span
        key={wordIndex}
        className="inline-block overflow-hidden pb-[0.05em]"
      >
        <span
          className={`inline-block will-change-transform block-${blockIndex}`}
        >
          {word}&nbsp;
        </span>
      </span>
    ));
  };

  return (
    <>
      {/* Scroll indicator bar at the top */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-white/10 z-50 pointer-events-none">
        <div
          ref={progressFillRef}
          className="w-full h-full bg-[#d1b797] origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Tall outer wrapper determines scroll duration */}
      <div
        ref={containerRef}
        className="w-full h-[300vh] relative bg-[#0b0b0b]"
      >
        {/* Pinned element inside stays locked in view */}
        <div
          ref={pinnedInnerRef}
          className="w-full h-screen flex flex-col justify-center items-center overflow-hidden"
        >
          <div className="relative w-[85%] max-w-[1200px] h-[40vh] flex justify-center items-center">
            {/* Paragraph 1 */}
            <div className="absolute w-full text-center p-container-0">
              <p className="text-white text-3xl md:text-5xl font-medium leading-relaxed tracking-tight">
                {renderSplitParagraph(PARAGRAPHS[0], 0)}
              </p>
            </div>

            {/* Paragraph 2 */}
            <div className="absolute w-full text-center p-container-1">
              <p className="text-white text-3xl md:text-5xl font-medium leading-relaxed tracking-tight">
                {renderSplitParagraph(PARAGRAPHS[1], 1)}
              </p>
            </div>

            {/* Paragraph 3 */}
            <div className="absolute w-full text-center p-container-2">
              <p className="text-white text-3xl md:text-5xl font-medium leading-relaxed tracking-tight">
                {renderSplitParagraph(PARAGRAPHS[2], 2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
