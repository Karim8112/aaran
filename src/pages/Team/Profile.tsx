import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { type MemberData } from "./Team";
import { useParams } from "react-router-dom";

// ==========================================
// FRAMER MOTION ANIMATION VARIANTS
// ==========================================

function getMemberById(
  members: MemberData[],
  id: number,
): MemberData | undefined {
  console.log("members inside fffff", id);
  const member = members.find((member) => member.id === id);
  console.log("member inside function", member);
  return member;
}
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 18,
    },
  },
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 18,
    },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ==========================================
// MAIN CV PAGE COMPONENT
// ==========================================

export default function CVPage() {
  const keySkills = [
    "DESIGN EXPERTISE",
    "USER-CENTRIC APPROACH",
    "LEADERSHIP",
    "CREATIVE THINKING",
    "STRATEGIC THINKING",
    "PRODUCT MANAGEMENT",
    "STAKEHOLDER MANAGEMENT",
    "TEAM MANAGEMENT",
    "CROSS-FUNCTIONAL COLLABORATION",
  ];

  const { memberId } = useParams<{ memberId: string }>();
  const [members, setMembers] = useState<MemberData[]>([]);
  let member: MemberData | undefined = {} as MemberData;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", memberId);
  useEffect(() => {
    // Note the leading slash: /teams.json points to the public folder root

    fetch("../../../public/team.json")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        member = getMemberById(data, Number(memberId));
        console.log("this is memeber", member);
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [memberId]);

  // ////////////////////////////////////////
  // memeber requested
  // //////////////////////////////////////
  console.log(member, members);

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#111111] font-sans selection:bg-[#111] selection:text-white px-6 md:px-16 lg:px-24 py-10 max-w-360 mx-auto antialiased">
      {/* Google Fonts Import for Display Serif & Cursive Signature */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,600&family=Reenie+Beanie&family=Space+Grotesk:wght@400;500;700&display=swap');
        
        .font-serif-italic {
          font-family: 'Playfair Display', serif;
          font-style: italic;
        }
        .font-signature {
          font-family: 'Reenie Beanie', cursive;
        }
      `}</style>

      {!isLoading ? (
        <>
          {" "}
          {/* ========================================== */}
          {/* 1. HEADER / NAVIGATION BAR                */}
          {/* ========================================== */}
          <motion.header
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col md:flex-row justify-between items-start md:items-center pb-12 mb-8 border-b border-black/10 gap-6"
          >
            {/* Brand Logo */}
            <motion.div
              variants={fadeInUp}
              className="text-xl font-black tracking-widest"
            >
              SIX
            </motion.div>

            {/* Navigation Blocks */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-start gap-8 md:gap-14 text-[11px] font-bold tracking-wider uppercase text-black/80"
            >
              <a
                href="#portfolio"
                className="hover:text-black transition-colors"
              >
                PORTFOLIO
              </a>
              <a
                href="#linkedin"
                className="hover:text-black transition-colors"
              >
                LINKEDIN
              </a>

              {/* Showcase Platforms */}
              <div className="flex flex-col gap-0.5">
                <span className="text-black/50 font-normal">
                  SHOWCASE PLATFORMS
                </span>
                <div className="flex gap-2">
                  <a
                    href="#dribbble"
                    className="hover:text-black transition-colors"
                  >
                    DRIBBBLE
                  </a>
                  <span>/</span>
                  <a
                    href="#behance"
                    className="hover:text-black transition-colors"
                  >
                    BEHANCE
                  </a>
                </div>
              </div>

              {/* Contact Details */}
              <div className="flex flex-col gap-0.5">
                <span className="text-black/50 font-normal">CONTACT</span>
                <a
                  href="mailto:HALYNA.KUCHERYAVA@GMAIL.COM"
                  className="hover:text-black transition-colors underline decoration-black/20"
                >
                  HALYNA.KUCHERYAVA@GMAIL.COM
                </a>
                <span className="text-black/70 font-mono tracking-tight">
                  +421 976 572 9274
                </span>
              </div>
            </motion.div>
          </motion.header>
          {/* ========================================== */}
          {/* 2. HERO TITLE SECTION                     */}
          {/* ========================================== */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-16 md:mb-24"
          >
            {/* Row 1: LEAD */}
            <motion.h1
              variants={fadeInUp}
              className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase leading-none"
            >
              {member.title}
            </motion.h1>

            {/* Row 2: DIGITAL PRODUCT */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-baseline gap-3 md:gap-6 mt-1 md:-mt-2"
            >
              <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase leading-none">
                DIGITAL
              </span>
              <span className="text-6xl sm:text-8xl md:text-9xl font-serif-italic font-normal tracking-tight">
                PRODUCT
              </span>
            </motion.div>

            {/* Row 3: Name Subtitle & DESIGNER */}
            <div className="grid grid-cols-1 md:grid-cols-12 items-baseline mt-1 md:-mt-2 gap-4">
              <motion.div
                variants={fadeInUp}
                className="md:col-span-4 flex flex-col"
              >
                <span className="text-sm font-bold tracking-widest uppercase">
                  HALYNA
                </span>
                <span className="text-sm font-bold tracking-widest uppercase text-black/70">
                  KUCHERYAVA
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="md:col-span-8 text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase leading-none md:text-right"
              >
                DESIGNER
              </motion.h1>
            </div>
          </motion.section>
          {/* ========================================== */}
          {/* 3. MIDDLE SECTION: SKILLS, QUOTE & IMAGE  */}
          {/* ========================================== */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-24 items-start">
            {/* Left Column: Key Skills & Quote */}
            <div className="lg:col-span-7 flex flex-col gap-14">
              {/* Key Skills */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="flex flex-col gap-2"
              >
                <motion.h3
                  variants={fadeInUp}
                  className="text-[11px] font-bold tracking-widest uppercase text-black/50 mb-2"
                >
                  KEY SKILLS
                </motion.h3>
                <div className="flex flex-col gap-1">
                  {keySkills.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      variants={fadeInLeft}
                      className="text-xs sm:text-sm font-bold tracking-wider text-black/80 uppercase"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Quote Block */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="flex items-start gap-4 pt-4 border-t border-black/10"
              >
                {/* Giant Quotation Mark */}
                <span className="text-5xl font-serif leading-none select-none text-black">
                  “
                </span>
                <div className="flex flex-col gap-4">
                  <p className="text-sm sm:text-base text-black/80 font-normal leading-relaxed max-w-lg">
                    As a designer and manager, I strive to create solutions that
                    harmonize user needs, business goals, and technical
                    possibilities—fostering meaningful innovation while guiding
                    and empowering my team.
                  </p>
                  {/* Handwritten Signature */}
                  <span className="font-signature text-3xl sm:text-4xl text-black/90">
                    Halyna
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Profile Image Placeholder / Graphic */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[420px] aspect-square bg-[#222222] rounded-md overflow-hidden flex flex-col justify-center items-center p-8 group shadow-xl transition-all duration-500 hover:shadow-2xl">
                {/* User Avatar SVG Placeholder matching the design mockup */}
                <div className="w-24 h-24 rounded-full border-4 border-white/80 flex justify-center items-center mb-4 transition-transform duration-500 group-hover:scale-110">
                  <div className="w-10 h-10 rounded-full bg-white/80" />
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <svg
                    className="w-6 h-6 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <span className="absolute bottom-4 right-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  PROFILE PORTRAIT
                </span>
              </div>
            </motion.div>
          </section>
          {/* ========================================== */}
          {/* 4. WORK EXPERIENCE SECTION                */}
          {/* ========================================== */}
          <section className="pt-12 border-t border-black/15">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Section Title Left */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInLeft}
                className="lg:col-span-4 flex flex-col gap-1"
              >
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tight uppercase">
                    WORK
                  </h2>
                  <span className="text-4xl sm:text-5xl font-serif-italic">
                    experience
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-black/40 uppercase mt-2">
                  RELEVANCE [05-1]
                </span>
              </motion.div>

              {/* Experience Details Right */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="lg:col-span-8 flex flex-col gap-8"
              >
                {/* Role Header */}
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-black/10 gap-2"
                >
                  <div>
                    <h3 className="text-base sm:text-lg font-black tracking-wider uppercase">
                      LEAD PRODUCT DESIGNER & TEAM MANAGER
                    </h3>
                    <span className="text-xs font-bold tracking-widest uppercase text-black/50">
                      FLYING BISONS
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold tracking-widest text-black/70">
                    JUL 2022 - PRESENT
                  </span>
                </motion.div>

                {/* Sub-Section 1: Project Estimation */}
                <motion.div variants={fadeInUp} className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-black/90">
                    PROJECT ESTIMATION AND PROCESS FACILITATION:
                  </h4>
                  <ul className="list-disc list-inside flex flex-col gap-1.5 text-xs sm:text-sm text-black/75 leading-relaxed pl-1">
                    <li>
                      Participated in initial project estimations and
                      contributed to the definition of designed processes.
                    </li>
                    <li>
                      Collaborated with stakeholders and team members to
                      establish project scope and requirements.
                    </li>
                    <li>
                      Assisted in creating project timelines and resource
                      allocation plans.
                    </li>
                    <li>
                      Facilitated workshops to gather requirements and align
                      project goals.
                    </li>
                  </ul>
                </motion.div>

                {/* Sub-Section 2: Design and Product Development */}
                <motion.div variants={fadeInUp} className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-black/90">
                    DESIGN AND PRODUCT DEVELOPMENT OVERSIGHT:
                  </h4>
                  <ul className="list-disc list-inside flex flex-col gap-1.5 text-xs sm:text-sm text-black/75 leading-relaxed pl-1">
                    <li>
                      Oversaw the end-to-end product development process,
                      ensuring alignment with business goals and user needs.
                    </li>
                    <li>
                      Assisted in user research, usability testing, and feedback
                      gathering to inform design decisions.
                    </li>
                    <li>
                      Delivered polished designs for various products including
                      websites, SaaS, and mobile apps.
                    </li>
                    <li>
                      Ensured designs met quality standards and addressed
                      stakeholder expectations.
                    </li>
                    <li>
                      Assisted in product optimization efforts post-launch to
                      enhance user experience and drive continued product
                      success.
                    </li>
                  </ul>
                </motion.div>

                {/* Sub-Section 3: Cross-Functional Collaboration */}
                <motion.div variants={fadeInUp} className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-black/90">
                    CROSS-FUNCTIONAL COLLABORATION:
                  </h4>
                  <ul className="list-disc list-inside flex flex-col gap-1.5 text-xs sm:text-sm text-black/75 leading-relaxed pl-1">
                    <li>
                      Worked with cross-functional teams comprising project
                      managers, business analysts, developers, QA analysts,
                      content writers, and product owners.
                    </li>
                  </ul>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </>
      ) : isError ? (
        <>Error page</>
      ) : (
        <>LoadingPage</>
      )}
    </div>
  );
}
