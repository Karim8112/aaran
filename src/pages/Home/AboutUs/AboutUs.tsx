import React, { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useMotionValue,
  type MotionValue,
} from "framer-motion";

// 10 Premium, high-quality, luxury contracting and architectural images
const MARQUEE_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1448630091924-883f6f93824a?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1504297366397-d3c95a71c2d6?auto=format&fit=crop&w=400&q=80",
];

const PARAGRAPHS = [
  "Core Expertise & Heritage Led by Eng. Basel Al-Zahir, Aaran Contracting & Trading combines 20+ years of civil and MEP expertise with specialized heritage restoration. Blending traditional craftsmanship with modern technology, the firm revitalizes iconic landmarks, most notably the Citadel of Aleppo.",
  "Global Execution & Vision, A trusted partner for UN agencies, Aaran executes complex international projects in sensitive environments under strict HSE protocols. The firm maintains transparency and efficiency while humanizing urban spaces—from schools to citadels—for future generations..",
  "At the core of our operations is a steadfast commitment to our Safety Protocols & ISO Standards. Under our cadre safety initiatives, we treat the prevention of work-related injuries and accidents as a major responsibility. Guided by the rigorous frameworks of ISO 603, our organizational philosophy dictates that safety is unequivocally prioritized over operational productivity. To sustain this uncompromising culture of vigilance in even the most complex environments, the company ensures the continuous delivery of comprehensive awareness courses and specialized risk avoidance training for all personnel..",
];

// Constants for word transition mathematics
const OVERLAP_COUNT = 3.5;

interface WordProps {
  word: string;
  progress: MotionValue<number>;
  inputRange: number[];
  outputRange: number[];
}

// Declarative Word Animator
const SplitWord: React.FC<WordProps> = ({
  word,
  progress,
  inputRange,
  outputRange,
}) => {
  // Map scroll progress to vertical position percentage
  const y = useTransform(
    progress,
    inputRange,
    outputRange.map((val) => `${val}%`),
  );

  return (
    <span className="inline-block overflow-hidden pb-[0.05em] vertical-bottom">
      <motion.span style={{ y }} className="inline-block will-change-transform">
        {word}&nbsp;
      </motion.span>
    </span>
  );
};

// Velocity-Responsive Infinite Marquee
const ResponsiveMarquee: React.FC<{
  images: string[];
  progress: MotionValue<number>;
}> = ({ images, progress }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Grab scrolling speed/velocity and run it through a stabilizer spring
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 60,
    stiffness: 300,
  });

  // Speed goes from 1.0 (base) up to 12.0 depending on scroll intensity
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 11], {
    clamp: true,
  });

  // Outro fade: starts fading out when scroll gets close to the end (from 80% to 100%)
  const opacity = useTransform(progress, [0, 0.8, 1.0], [1, 1, 0]);

  useEffect(() => {
    let active = true;
    let currentX = 0;

    const tick = () => {
      if (!active || !trackRef.current) return;

      const baseSpeed = 1.0; // Clean, slow resting speed
      const boost = Math.abs(velocityFactor.get());
      currentX -= baseSpeed + boost;

      // Reset coordinates perfectly once half the track has scrolled past
      const halfWidth = trackRef.current.scrollWidth / 2;
      if (halfWidth > 0 && currentX <= -halfWidth) {
        currentX = 0;
      }

      x.set(currentX);
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return () => {
      active = false;
    };
  }, [x, velocityFactor]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-[8vh] left-0 w-full overflow-hidden whitespace-nowrap z-20 pointer-events-none"
    >
      <motion.div ref={trackRef} style={{ x }} className="inline-flex gap-8">
        {/* Original Set of 10 Images */}
        {images.map((src, idx) => (
          <div
            key={`orig-${idx}`}
            className="w-[180px] h-[120px] rounded-xl overflow-hidden shrink-0"
          >
            <img
              src={src}
              className="w-full h-full object-cover select-none"
              alt=""
            />
          </div>
        ))}
        {/* Seamless Duplicated Set of 10 Images */}
        {images.map((src, idx) => (
          <div
            key={`clone-${idx}`}
            className="w-[180px] h-[120px] rounded-xl overflow-hidden shrink-0"
          >
            <img
              src={src}
              className="w-full h-full object-cover select-none"
              alt=""
            />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default function FramerScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll progress of the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Top progress bar expansion (maps 0-1 progress to horizontal scale)
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Outro opacity helper for the text containers
  const p1Opacity = useTransform(
    scrollYProgress,
    [0, 0.48, 0.52, 1],
    [1, 1, 0, 0],
  );
  const p2Opacity = useTransform(
    scrollYProgress,
    [0, 0.48, 0.52, 0.98, 1],
    [0, 0, 1, 1, 0],
  );
  const p3Opacity = useTransform(
    scrollYProgress,
    [0, 0.48, 0.52, 1],
    [0, 0, 0, 1],
  );

  // Math translation helpers for stagger calculations
  const calculateStaggerRanges = (
    paragraphIndex: number,
    totalWords: number,
  ) => {
    const totalLength = 1 + OVERLAP_COUNT / totalWords;
    const scale = 1 / totalLength;

    return Array.from({ length: totalWords }).map((_, i) => {
      const start = (i / totalWords) * scale;
      const end = start + (OVERLAP_COUNT / totalWords) * scale;

      if (paragraphIndex === 0) {
        // Phase 1 (0 to 0.5): goes from 0% to -105%
        return {
          input: [0, start * 0.5, end * 0.5, 1.0],
          output: [0, 0, -105, -105],
        };
      } else if (paragraphIndex === 1) {
        // Phase 1 (0 to 0.5): comes from 105% to 0%
        // Phase 2 (0.5 to 1.0): goes from 0% to -105%
        const phase2Start = 0.5 + start * 0.5;
        const phase2End = 0.5 + end * 0.5;

        return {
          input: [0, start * 0.5, end * 0.5, phase2Start, phase2End, 1.0],
          output: [105, 105, 0, 0, -105, -105],
        };
      } else {
        // Phase 2 (0.5 to 1.0): comes from 105% to 0%
        const phase2Start = 0.5 + start * 0.5;
        const phase2End = 0.5 + end * 0.5;
        return {
          input: [0, phase2Start, phase2End, 1.0],
          output: [105, 105, 0, 0],
        };
      }
    });
  };

  const renderFramerParagraph = (text: string, paragraphIndex: number) => {
    const words = text.split(" ");
    const ranges = calculateStaggerRanges(paragraphIndex, words.length);

    return words.map((word, wordIndex) => (
      <SplitWord
        key={wordIndex}
        word={word}
        progress={scrollYProgress}
        inputRange={ranges[wordIndex].input}
        outputRange={ranges[wordIndex].output}
      />
    ));
  };

  return (
    <>
      {/* Dynamic top scroll indicator bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-white/10 z-50 pointer-events-none">
        <motion.div
          style={{ scaleX: progressScaleX }}
          className="w-full h-full bg-[#d1b797] origin-left"
        />
      </div>

      {/* Tall container holds scroll depth */}
      <div
        ref={containerRef}
        className="w-full h-[300vh] relative bg-[#0b0b0b]"
      >
        {/* Sticky viewport frames the entire experience natively */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center">
          <div className="relative w-[85%] max-w-[1200px] h-[40vh] flex justify-center items-center">
            {/* Paragraph 1 Container */}
            <motion.div
              style={{ opacity: p1Opacity }}
              className="absolute w-full text-center"
            >
              <p className="text-white text-3xl md:text-5xl font-medium leading-relaxed tracking-tight">
                {renderFramerParagraph(PARAGRAPHS[0], 0)}
              </p>
            </motion.div>

            {/* Paragraph 2 Container */}
            <motion.div
              style={{ opacity: p2Opacity }}
              className="absolute w-full text-center"
            >
              <p className="text-white text-3xl md:text-5xl font-medium leading-relaxed tracking-tight">
                {renderFramerParagraph(PARAGRAPHS[1], 1)}
              </p>
            </motion.div>

            {/* Paragraph 3 Container */}
            <motion.div
              style={{ opacity: p3Opacity }}
              className="absolute w-full text-center"
            >
              <p className="text-white text-3xl md:text-5xl font-medium leading-relaxed tracking-tight">
                {renderFramerParagraph(PARAGRAPHS[2], 2)}
              </p>
            </motion.div>
          </div>

          {/* Infinite Velocity-Responsive Marquee */}
          <ResponsiveMarquee
            images={MARQUEE_IMAGES}
            progress={scrollYProgress}
          />
        </div>
      </div>
    </>
  );
}
