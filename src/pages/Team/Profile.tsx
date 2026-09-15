import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { type MemberData } from "./Team";
// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

// ==========================================
// 2. FRAMER MOTION ANIMATION VARIANTS
// ==========================================
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
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
      stiffness: 80,
      damping: 15,
    },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Default fallback skills if none provided in team.json

// ==========================================
// 3. MAIN PROFILE COMPONENT
// ==========================================
export default function Profile() {
  const { memberId } = useParams<{ memberId: string }>();

  const [member, setMember] = useState<MemberData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!memberId) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    // Fetch team dataset from public directory
    fetch("/team.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load team data");
        return res.json();
      })
      .then((data: MemberData[]) => {
        const foundMember = data.find((m) => String(m.id) === String(memberId));
        if (foundMember) {
          setMember(foundMember);
        } else {
          setIsError(true);
        }
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [memberId]);

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col gap-6! items-center justify-center p-6!">
        <div className="w-12 h-12 border-4 border-[#d1b797] border-t-transparent rounded-full animate-spin mb-4!" />
        <p className="text-sm uppercase tracking-widest text-zinc-400">
          Loading Profile...
        </p>
      </div>
    );
  }

  // Error State
  if (isError || !member) {
    return (
      <div className="min-h-screen  bg-[#0d0d0d] text-white flex flex-col  gap-6! items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-bold text-red-400 mb-2">
          Member Not Found
        </h2>
        <p className="text-zinc-400 mb-6 max-w-md">
          We couldn't find a team member matching ID{" "}
          <code className="text-[#d1b797]">{memberId}</code>.
        </p>
        <Link
          to="/teams"
          className="px-6! py-3!  text-white font-semibold rounded-full hover:bg-white hover:text-black transition-colors duration-300"
        >
          Return to Team Page
        </Link>
      </div>
    );
  }

  const profileImage =
    member.imageRight ||
    member.imageLeft ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
  const skillsList = member.skills;

  return (
    <div className=" bg-[#0d0d0d] text-zinc-100 selection:bg-[#d1b797] selection:text-black pt-24! md:px-12! px-6!">
      {/* Main Content Area */}
      <motion.main
        className=" mx-auto flex flex-col gap-18!"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left Column: Portrait Card */}
          <motion.div className="lg:col-span-5" variants={scaleIn}>
            <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl group">
              <img
                src={profileImage}
                alt={member.title}
                className="w-full h-120! object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-2 left-4 right-4">
                <span className="inline-block px-3! py-1! bg-[#d1b797]/20 border mb-4! border-[#d1b797]/40 text-[#d1b797] text-xs font-semibold tracking-wider uppercase rounded-full backdrop-blur-md">
                  {member.tags}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Biography & Details */}
          <motion.div
            className="lg:col-span-7 flex flex-col justify-center"
            variants={fadeInUp}
          >
            <div className="mb-8">
              <span className="text-xs uppercase tracking-widest mb-4! text-[#d1b797] font-semibold block ">
                Team Member Profile
              </span>
              <h1 className="text-3xl! md:text-5xl font-extrabold! tracking-tight text-white mb-4!">
                {member.title}
              </h1>
              <p className="text-xl text-zinc-400 mb-4! font-light leading-relaxed">
                {member.summary ||
                  `Passionate ${member.tags} dedicated to crafting impactful digital products, elevating user experiences, and driving team excellence.`}
              </p>
            </div>

            <div className="p-6 rounded-xl px-4! py-4! bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6!">
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">
                  Role & Focus
                </span>
                <span className="text-sm font-medium text-zinc-200">
                  {member.tags}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">
                  Direct Email
                </span>
                <a
                  href={`mailto:${member.email || "contact@aaran.com"}`}
                  className="text-sm font-medium text-[#d1b797] hover:underline"
                >
                  {member.email ||
                    `${member.title.toLowerCase().replace(/[^a-z]/g, "")}@aaran.com`}
                </a>
              </div>
            </div>

            <div className="p-6 rounded-xl px-4! py-4! bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">
                  Education
                </span>
                <span className="text-sm font-medium text-zinc-200">
                  {member.education}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">
                  Languages
                </span>
                {member.languages &&
                  member.languages?.map((lan, index) => {
                    return (
                      <span className="text-sm font-medium text-zinc-200">
                        {index == 0 ? "" : ", "}
                        {lan}
                      </span>
                    );
                  })}
              </div>
            </div>
            {/* Actions */}
          </motion.div>
        </div>

        {/* Section 2: Key Skills & Expertise */}
        <motion.section className="h-fit!" variants={fadeInLeft}>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xl! font-bold! uppercase tracking-wider! text-white mb-4!">
              Technical Skills
            </h3>
            <div className="h-px bg-zinc-800 flex-1" />
          </div>

          <div className="flex flex-wrap gap-3">
            {skillsList.map((skill, idx) => (
              <motion.span
                key={idx}
                variants={fadeInUp}
                className="px-4! py-2! bg-zinc-900 border border-zinc-800 hover:border-[#d1b797]/50 text-zinc-300 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.section>

        {/* Section 3: Experience & Contributions */}
        <motion.section className="h-fit! pb-18!" variants={fadeInUp}>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xl! font-bold! uppercase tracking-wider! text-white mb-4!">
              Experience & Background
            </h3>
            <div className="h-px bg-zinc-800 flex-1" />
          </div>

          <div className="flex flex-col gap-6!">
            {member.experience &&
              member.experience.map((item, index) => (
                <div
                  key={index}
                  className="p-6!  rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2! mb-2!">
                    <h4 className="text-lg font-bold text-white">
                      {item.role}
                    </h4>
                    <span className="text-xs px-4! font-mono text-[#d1b797] bg-[#d1b797]/10 py-1! rounded-full border border-[#d1b797]/20">
                      {item.period}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-zinc-400 mb-3">
                    {item.company}
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}
