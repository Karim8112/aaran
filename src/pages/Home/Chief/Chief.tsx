// import React, { useRef, useState } from "react";
// import {
//   motion,
//   useScroll,
//   useTransform,
//   useSpring,
//   useMotionValueEvent,
//   //   AnimatePresence,
// } from "framer-motion";

// // Premium architectural portrait images (Replace with your local asset paths if needed)
// const TEAM_MEMBERS = [
//   {
//     name: "Eng. Bassel Al-Zaher",
//     university: "Aleppo University - Faculty of Civil Engineering",
//     phones: ["+963 123987 12312", "+963 123987 12312"],
//     email: "b.alzaher@aaran-co.com",
//     role: "Structural Engineer & Chief Engineer",
//     experience: "20 Years' Experience",
//     image:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
//   },
//   {
//     name: "Arch. Layla Masri",
//     university: "Damascus University - Faculty of Architecture",
//     phones: ["+963 987654 32101", "+963 987654 32102"],
//     email: "l.masri@aaran-co.com",
//     role: "Senior Interior Designer & Art Director",
//     experience: "12 Years' Experience",
//     image:
//       "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
//   },
//   {
//     name: "Eng. Tareq Bilal",
//     university: "American University - Construction Management",
//     phones: ["+963 555444 33321", "+963 555444 33322"],
//     email: "t.bilal@aaran-co.com",
//     role: "Project Management Director",
//     experience: "15 Years' Experience",
//     image:
//       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
//   },
// ];

// export default function Chief() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [activeIndex, setActiveIndex] = useState(0);

//   // 1. Monitor scroll progress of the entire tall container (300vh)
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"],
//   });

//   // 2. Track scroll progress to update active image variants
//   useMotionValueEvent(scrollYProgress, "change", (latest) => {
//     if (latest < 0.3) {
//       setActiveIndex(0);
//     } else if (latest >= 0.3 && latest < 0.7) {
//       setActiveIndex(1);
//     } else {
//       setActiveIndex(2);
//     }
//   });

//   // 3. Create professional scrolling plateaus for the text columns
//   // The text remains stationary at 0% (Bassel), slides smoothly to -100% (Layla), stays there, and then slides to -200% (Tareq)
//   const textY = useTransform(
//     scrollYProgress,
//     [0, 0.2, 0.4, 0.6, 0.8, 1.0],
//     ["0%", "0%", "-100%", "-100%", "-200%", "-200%"],
//   );

//   // Apply elegant physics spring to smooth out the slide transition
//   const smoothTextY = useSpring(textY, {
//     stiffness: 85,
//     damping: 22,
//     mass: 0.8,
//   });

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full h-[300vh] bg-[#1a1a1a]" // 300vh height controls scroll speed/duration
//     >
//       {/* Pinned main view - Locks into position during the scroll */}
//       <div className="sticky top-0 left-0 w-full h-screen flex justify-center items-center overflow-hidden px-6 md:px-12 lg:px-20">
//         {/* Symmetric 3-Column Grid matching Frame 8.png */}
//         <div className="w-full max-w-[1400px] h-[75vh] grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-0 border border-white/5 rounded-3xl bg-[#222222]/40 backdrop-blur-md overflow-hidden">
//           {/* ================= COLUMN 1: LEFT DETAILS (Col-span 4) ================= */}
//           <div className="md:col-span-4 h-full border-b md:border-b-0 md:border-r border-white/10 relative p-8 md:p-12 flex flex-col justify-center overflow-hidden">
//             <motion.div
//               style={{ y: smoothTextY }}
//               className="absolute left-8 md:left-12 right-8 md:right-12"
//             >
//               {TEAM_MEMBERS.map((member, i) => (
//                 <div
//                   key={`left-${i}`}
//                   className="h-[50vh] flex flex-col justify-center gap-6"
//                   style={{ height: "50vh" }}
//                 >
//                   <div>
//                     <h2 className="text-4xl md:text-5xl font-semibold text-[#d1b797] tracking-tight mb-3">
//                       {member.name}
//                     </h2>
//                     <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
//                       {member.university}
//                     </p>
//                   </div>

//                   <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
//                     {member.phones.map((phone, idx) => (
//                       <span
//                         key={idx}
//                         className="text-sm text-white/60 tracking-wider font-light"
//                       >
//                         {phone}
//                       </span>
//                     ))}
//                     <a
//                       href={`mailto:${member.email}`}
//                       className="text-sm text-white/50 hover:text-[#d1b797] transition-colors duration-300 font-light mt-1"
//                     >
//                       {member.email}
//                     </a>
//                   </div>
//                 </div>
//               ))}
//             </motion.div>
//           </div>

//           {/* ================= COLUMN 2: MIDDLE DETAILS & ICON (Col-span-4) ================= */}
//           <div className="md:col-span-4 h-full border-b md:border-b-0 md:border-r border-white/10 relative p-8 md:p-12 flex flex-col justify-center overflow-hidden bg-[#222222]/10">
//             <motion.div
//               style={{ y: smoothTextY }}
//               className="absolute left-8 md:left-12 right-8 md:right-12"
//             >
//               {TEAM_MEMBERS.map((member, i) => (
//                 <div
//                   key={`mid-${i}`}
//                   className="h-[50vh] flex flex-col justify-center items-start gap-8"
//                   style={{ height: "50vh" }}
//                 >
//                   {/* Detailed gold monogram SVG matching the design */}
//                   <div className="w-24 h-24 text-[#d1b797] flex items-center justify-center">
//                     <svg
//                       className="w-full h-full stroke-current fill-none"
//                       viewBox="0 0 100 100"
//                       strokeWidth="1.75"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       {/* Gothic arch contours */}
//                       <path d="M20,80 C20,38 35,15 50,15 C65,15 80,38 80,80" />
//                       <path d="M32,80 C32,48 40,30 50,30 C60,30 68,48 68,80" />
//                       {/* Interlacing monogram details */}
//                       <path d="M50,15 L50,80" />
//                       <path d="M35,80 L35,48 C35,43 42,40 50,48 C58,40 65,43 65,48 L65,80" />
//                     </svg>
//                   </div>

//                   <div>
//                     <h3 className="text-xl font-medium text-[#d1b797] mb-1">
//                       {member.role}
//                     </h3>
//                     <p className="text-sm text-white/60 font-light">
//                       {member.experience}
//                     </p>
//                   </div>

//                   <button className="px-6 py-3 bg-white text-black hover:bg-[#d1b797] hover:text-white rounded-full font-semibold text-sm transition-all duration-300 shadow-lg tracking-wider">
//                     check teammates
//                   </button>
//                 </div>
//               ))}
//             </motion.div>
//           </div>

//           {/* ================= COLUMN 3: STICKY IMAGE CARD (Col-span-4) ================= */}
//           <div className="md:col-span-4 h-full p-6 md:p-8 flex items-center justify-center bg-[#282828]/20">
//             <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#2d2d2d] shadow-2xl">
//               {/* Fallback layout/background gradient matching Frame 8.png */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/5 z-10 pointer-events-none" />

//               {/* Dynamic crossfade image layers */}
//               {TEAM_MEMBERS.map((member, i) => (
//                 <motion.div
//                   key={`img-${i}`}
//                   initial={{ opacity: 0, scale: 1.06 }}
//                   animate={{
//                     opacity: activeIndex === i ? 1 : 0,
//                     scale: activeIndex === i ? 1 : 1.06,
//                     filter:
//                       activeIndex === i ? "grayscale(0%)" : "grayscale(100%)",
//                   }}
//                   transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
//                   className="absolute inset-0 w-full h-full"
//                 >
//                   <img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </motion.div>
//               ))}

//               {/* Decorative overlay text matching the design placeholder */}
//               <div className="absolute bottom-6 left-6 z-20">
//                 <span className="text-xs uppercase tracking-widest text-white/40 font-mono">
//                   Active Teammate / 0{activeIndex + 1}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 4 Premium, high-quality architectural and space design images
const IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80", // Concept space
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=1000&q=80", // Brutalist curves
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80", // Clean bright geometry
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80", // Architectural facade
];

const PARAGRAPHS = [
  {
    number: "01",
    category: "CONCEPT & ARCHETYPE",
    title:
      "We design spaces that breathe, move, and tell your unique architectural story.",
    desc: "Every conceptual sketch is shaped to harmonize with local terrain, wind dynamics, and natural sunlight angles.",
  },
  {
    number: "02",
    category: "STRUCTURAL INTEGRITY",
    title:
      "Every blueprint is a commitment to engineering precision and sustainable innovation.",
    desc: "We build skeletons of steel and concrete designed to surpass standard life expectancy while carrying an elegant minimal footprint.",
  },
  {
    number: "03",
    category: "LUXURY CONTRACTING",
    title:
      "From conception to final brick, we craft luxury contracting solutions for tomorrow.",
    desc: "Our master-builders operate with extreme millimeter precision, executing high-end custom millwork and intricate masonry.",
  },
  {
    number: "04",
    category: "TIMELESS LEGACY",
    title:
      "Our completed landscapes represent a timeless testament to human collaboration.",
    desc: "A structural triumph is only achieved when design merges seamlessly with daily functionality and absolute comfort.",
  },
];

export default function StickyImageScroll() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative w-full bg-[#0b0b0b] text-white">
      {/* Side-by-Side Grid Container */}
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-12">
        {/* ==================== LEFT COLUMN (STICKY IMAGE CONTAINER) ==================== */}
        <div className="col-span-12 md:col-span-5 h-[50vh] md:h-screen md:sticky md:top-0 flex items-center justify-center z-10 py-8 md:py-0">
          <div className="relative w-full aspect-[4/5] md:w-[90%] md:h-[65vh] rounded-3xl overflow-hidden bg-neutral-900/40 border border-white/5">
            {/* Smooth visual swapping using Framer Motion crossfades */}
            <AnimatePresence mode="popLayout">
              <motion.img
                key={activeIndex}
                src={IMAGES[activeIndex]}
                initial={{ opacity: 0, scale: 1.08, filter: "grayscale(100%)" }}
                animate={{ opacity: 1, scale: 1, filter: "grayscale(0%)" }}
                exit={{ opacity: 0, scale: 0.96, filter: "grayscale(100%)" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
                alt={`Architectural process phase ${activeIndex + 1}`}
              />
            </AnimatePresence>

            {/* Subtle Overlay to match elite website aesthetics */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Bottom active status flag on image */}
            <div className="absolute bottom-6 left-6 flex items-center gap-3 backdrop-blur-md bg-black/30 border border-white/10 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-white/80">
              <span className="w-1.5 h-1.5 bg-[#d1b797] rounded-full animate-pulse" />
              PHASE_0{activeIndex + 1}
            </div>
          </div>
        </div>

        {/* ==================== RIGHT COLUMN (NATURAL SCROLL TEXT) ==================== */}
        <div className="col-span-12 md:col-span-7 flex flex-col justify-start">
          {PARAGRAPHS.map((item, idx) => (
            <motion.div
              key={idx}
              // Set up safe viewport boundaries
              initial={{ opacity: 0.35, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.45, margin: "-10% 0px -25% 0px" }}
              // Trigger image variant changes dynamically on entering view
              onViewportEnter={() => {
                setActiveIndex(idx);
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-[80vh] md:min-h-screen flex flex-col justify-center py-24 md:py-0 border-b border-white/5 last:border-b-0"
            >
              {/* Category and Index Indicator */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-mono text-[#d1b797] bg-[#d1b797]/10 px-3 py-1 rounded-full border border-[#d1b797]/20">
                  {item.number}
                </span>
                <span className="text-xs font-mono tracking-wider text-white/50">
                  {item.category}
                </span>
              </div>

              {/* Elegant main text heading */}
              <h2 className="text-2xl md:text-4xl font-light leading-snug tracking-tight text-white mb-6 max-w-[580px]">
                {item.title}
              </h2>

              {/* Accompanying deep detail block */}
              <p className="text-sm md:text-base font-light leading-relaxed text-white/40 max-w-[480px]">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
