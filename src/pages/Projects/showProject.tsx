import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  Building2,
  Folder,
  Image as ImageIcon,
  Layers,
  Maximize2,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

// Custom & UI Components
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useProject } from "./useProject";
import LoadingScreen from "../Loading";

// --- Framer Motion Animation Variants (Matched from Reference Page) ---
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

export default function ShowProject() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "before" | "after">("all");
  const projectHook = useProject();
  const { projectId } = useParams();

  useEffect(() => {
    if (projectId) projectHook.getOne({ id: projectId });
  }, []);

  const hasBeforeAfter =
    (projectHook.oneProject?.imagesBefore &&
      projectHook.oneProject?.imagesBefore.length > 0) ||
    (projectHook.oneProject?.imagesAfter &&
      projectHook.oneProject?.imagesAfter.length > 0);

  return !projectHook.loading ? (
    <>
      <div className="bg-white! px-6! py-28! text-black! selection:bg-[#d1b797]! selection:text-black! dark:bg-[#0d0d0d]! dark:text-zinc-100! md:px-12!">
        {/* Main Content Area */}
        <motion.main
          className="mx-auto! mb-20! flex! max-w-7xl! flex-col! gap-16!"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section: Main Image & Project Overview */}
          <div className="flex! w-full! flex-col! items-start! gap-12! lg:flex-row!">
            {/* Left Column: Hero Main Image Card */}
            <motion.div
              className="w-full! lg:w-[45%]! lg:min-w-[420px]!"
              variants={scaleIn}
            >
              <div className="group! relative! min-h-[400px]! overflow-hidden! rounded-2xl! border! border-gray-100! bg-gray-100! shadow-2xl! dark:border-zinc-800! dark:bg-zinc-900!">
                <img
                  src={projectHook.oneProject?.mainImage}
                  alt={projectHook.oneProject?.name}
                  className="max-h-[550px]! cursor-pointer! w-full! object-cover! object-center! transition-transform! duration-700! ease-out! group-hover:scale-105!"
                />
                <div className="absolute! inset-0! bg-gradient-to-t! from-black/80! via-black/20! to-transparent!" />

                {/* Top Corner Badge */}
                {projectHook.oneProject?.projectType?.name && (
                  <div className="absolute! left-4! top-4!">
                    <span className="inline-flex! items-center! gap-1.5! rounded-full! border! border-[#d1b797]/40! bg-[#d1b797]/20! px-3.5! py-1! text-xs! font-semibold! uppercase! tracking-wider! text-[#000]! backdrop-blur-md!">
                      <Folder className="h-3.5! w-3.5!" />
                      {projectHook.oneProject?.projectType.name}
                    </span>
                  </div>
                )}

                {/* Bottom Corner Expand Action */}
                <div className="absolute! bottom-4! right-4! cursor-pointer!">
                  <button
                    onClick={() =>
                      setSelectedImage(
                        projectHook.oneProject?.mainImage ?? null,
                      )
                    }
                    className="flex! cursor-pointer! items-center! gap-2! rounded-xl! border! border-white/20! bg-black/60! px-3.5! py-2! text-xs! font-medium! text-white! backdrop-blur-md! transition-all! hover:bg-black/80!"
                  >
                    <Maximize2 className="h-3.5! w-3.5! text-[#d1b797]!" />
                    <span>Expand Cover</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Title, Details & Quick Overview */}
            <motion.div
              className="flex! grow! flex-col! justify-center!"
              variants={fadeInUp}
            >
              <div className="mb-6!">
                <span className="mb-2! block! text-xs! font-semibold! uppercase! tracking-widest! text-[#d1b797]!">
                  Project Showcase
                </span>
                <h1 className="mb-4! text-3xl! font-semibold! tracking-wide! text-[#18181B]! dark:text-white! md:text-5xl!">
                  {projectHook.oneProject?.name}
                </h1>
              </div>

              {/* Metadata Info Card */}
              <div className="mb-6! grid! grid-cols-1! gap-4! rounded-xl! border! border-gray-100! bg-zinc-900/5! p-6! backdrop-blur-sm! dark:border-zinc-800/80! dark:bg-zinc-900/60! sm:grid-cols-2!">
                <div>
                  <span className="mb-1! block! text-xs! uppercase! tracking-wider! text-zinc-700! dark:text-zinc-500!">
                    Project Category
                  </span>
                  <span className="text-sm! font-medium! text-zinc-900! dark:text-zinc-200!">
                    {projectHook.oneProject?.projectType?.name || "-"}
                  </span>
                </div>

                <div>
                  <span className="mb-1! block! text-xs! uppercase! tracking-wider! text-zinc-700! dark:text-zinc-500!">
                    Organization / Client
                  </span>
                  <div className="flex! items-center! gap-1.5! text-sm! font-medium! text-zinc-900! dark:text-zinc-200!">
                    <Building2 className="h-4! w-4! text-[#d1b797]!" />
                    <span>{projectHook.oneProject?.organization || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Quick Overview Highlight Box */}
              <div className="rounded-xl! border! border-[#d1b797]/30! bg-[#d1b797]/10! p-6! backdrop-blur-sm! dark:border-[#d1b797]/20! dark:bg-[#d1b797]/5!">
                <span className="mb-2! flex! items-center! gap-2! text-xs! font-semibold! uppercase! tracking-wider! text-[#d1b797]!">
                  <Sparkles className="h-4! w-4! text-[#d1b797]!" /> Quick
                  Overview
                </span>
                <p className="text-base! font-normal! leading-relaxed! text-zinc-800! dark:text-zinc-300!">
                  {projectHook.oneProject?.quickOverview}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Section 2: Detailed Project Summary */}
          {projectHook.oneProject?.summary && (
            <motion.section className="h-fit!" variants={fadeInLeft}>
              <div className="mb-4! flex! items-center! gap-4!">
                <h3 className="flex! items-center! gap-2! text-xl! uppercase! tracking-wider! text-[#18181B]! dark:font-semibold! dark:text-white!">
                  <Layers className="h-5! w-5! text-[#d1b797]!" />
                  Project Description & Details
                </h3>
                <div className="h-px! flex-1! bg-zinc-600! dark:bg-zinc-800!" />
              </div>

              <div className="rounded-xl! border! border-gray-300! bg-white! p-6! transition-colors! dark:border-zinc-800/80! dark:bg-zinc-900/40!">
                <p className="whitespace-pre-line! text-sm! leading-relaxed! text-zinc-700! dark:text-zinc-300! md:text-base!">
                  {projectHook.oneProject?.summary}
                </p>
              </div>
            </motion.section>
          )}

          {/* Section 3: Before & After Transformation Gallery */}
          {hasBeforeAfter && (
            <motion.section className="pb-18! h-fit!" variants={fadeInUp}>
              <div className="mb-6! flex! flex-col! justify-between! gap-4! sm:flex-row! sm:items-center!">
                <div className="flex! flex-1! items-center! gap-4!">
                  <h3 className="flex! items-center! gap-2! text-xl! uppercase! tracking-wider! text-[#18181B]! dark:font-semibold! dark:text-white!">
                    <ImageIcon className="h-5! w-5! text-[#d1b797]!" />
                    Transformation Gallery
                  </h3>
                  <div className="h-px! flex-1! bg-zinc-600! dark:bg-zinc-800!" />
                </div>

                {/* Filter Tabs */}
                <Tabs
                  defaultValue="all"
                  value={activeTab}
                  onValueChange={(v: unknown) => {
                    if (v === "all" || v === "before" || v === "after") {
                      setActiveTab(v);
                    }
                  }}
                  className="w-full! sm:w-auto!"
                >
                  <TabsList className="grid! w-full! grid-cols-3! rounded-xl! border! border-gray-300! bg-gray-100! p-1! dark:border-zinc-800! dark:bg-zinc-900! sm:w-auto!">
                    <TabsTrigger
                      value="all"
                      className="rounded-lg! px-4! py-1.5! text-xs! font-semibold! uppercase! tracking-wider! text-zinc-600! transition-all! data-[state=active]:bg-[#d1b797]! data-[state=active]:text-black! dark:text-zinc-400! dark:data-[state=active]:bg-[#d1b797]! dark:data-[state=active]:text-black!"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="before"
                      className="rounded-lg! px-4! py-1.5! text-xs! font-semibold! uppercase! tracking-wider! text-zinc-600! transition-all! data-[state=active]:bg-[#d1b797]! data-[state=active]:text-black! dark:text-zinc-400! dark:data-[state=active]:bg-[#d1b797]! dark:data-[state=active]:text-black!"
                    >
                      Before
                    </TabsTrigger>
                    <TabsTrigger
                      value="after"
                      className="rounded-lg! px-4! py-1.5! text-xs! font-semibold! uppercase! tracking-wider! text-zinc-600! transition-all! data-[state=active]:bg-[#d1b797]! data-[state=active]:text-black! dark:text-zinc-400! dark:data-[state=active]:bg-[#d1b797]! dark:data-[state=active]:text-black!"
                    >
                      After
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Gallery Grid */}
              <div className="grid! grid-cols-1! gap-6! md:grid-cols-2!">
                {/* Before Images Column */}
                {(activeTab === "all" || activeTab === "before") &&
                  projectHook.oneProject?.imagesBefore &&
                  projectHook.oneProject?.imagesBefore.length > 0 && (
                    <div className="rounded-xl! border! border-red-500/30! bg-red-500/5! p-6! backdrop-blur-sm! dark:border-red-500/20! dark:bg-red-950/10!">
                      <div className="mb-4! flex! items-center! justify-between!">
                        <h4 className="text-sm! font-bold! uppercase! tracking-wider! text-red-600! dark:text-red-400!">
                          Before Phase
                        </h4>
                        <span className="rounded-full! border! border-red-500/30! bg-red-500/10! px-3! py-0.5! font-mono! text-xs! font-medium! text-red-600! dark:text-red-400!">
                          {projectHook.oneProject?.imagesBefore.length} Image(s)
                        </span>
                      </div>
                      <div className="grid! grid-cols-1! gap-3! sm:grid-cols-2!">
                        {projectHook.oneProject?.imagesBefore.map(
                          (imgUrl, index) => (
                            <motion.div
                              key={`before-${index}`}
                              whileHover={{ scale: 1.03 }}
                              className="group! relative! aspect-video! cursor-pointer! overflow-hidden! rounded-xl! border! border-gray-200! bg-gray-100! shadow-sm! dark:border-zinc-800! dark:bg-zinc-900!"
                              onClick={() => setSelectedImage(imgUrl)}
                            >
                              <img
                                src={imgUrl}
                                alt={`Before stage ${index + 1}`}
                                className="h-full! w-full! object-cover! transition-transform! duration-500! group-hover:scale-105!"
                              />
                              <div className="absolute! inset-0! flex! items-center! justify-center! bg-black/40! opacity-0! transition-opacity! group-hover:opacity-100!">
                                <Maximize2 className="h-5! w-5! text-white!" />
                              </div>
                            </motion.div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* After Images Column */}
                {(activeTab === "all" || activeTab === "after") &&
                  projectHook.oneProject?.imagesAfter &&
                  projectHook.oneProject?.imagesAfter.length > 0 && (
                    <div className="rounded-xl! border! border-emerald-500/30! bg-emerald-500/5! p-6! backdrop-blur-sm! dark:border-emerald-500/20! dark:bg-emerald-950/10!">
                      <div className="mb-4! flex! items-center! justify-between!">
                        <h4 className="text-sm! font-bold! uppercase! tracking-wider! text-emerald-600! dark:text-emerald-400!">
                          After Completion
                        </h4>
                        <span className="rounded-full! border! border-emerald-500/30! bg-emerald-500/10! px-3! py-0.5! font-mono! text-xs! font-medium! text-emerald-600! dark:text-emerald-400!">
                          {projectHook.oneProject?.imagesAfter.length} Image(s)
                        </span>
                      </div>
                      <div className="grid! grid-cols-1! gap-3! sm:grid-cols-2!">
                        {projectHook.oneProject?.imagesAfter.map(
                          (imgUrl, index) => (
                            <motion.div
                              key={`after-${index}`}
                              whileHover={{ scale: 1.03 }}
                              className="group! relative! aspect-video! cursor-pointer! overflow-hidden! rounded-xl! border! border-gray-200! bg-gray-100! shadow-sm! dark:border-zinc-800! dark:bg-zinc-900!"
                              onClick={() => setSelectedImage(imgUrl)}
                            >
                              <img
                                src={imgUrl}
                                alt={`After stage ${index + 1}`}
                                className="h-full! w-full! object-cover! transition-transform! duration-500! group-hover:scale-105!"
                              />
                              <div className="absolute! inset-0! flex! items-center! justify-center! bg-black/40! opacity-0! transition-opacity! group-hover:opacity-100!">
                                <Maximize2 className="h-5! w-5! text-white!" />
                              </div>
                            </motion.div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </motion.section>
          )}
        </motion.main>
      </div>

      {/* Lightbox Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed! inset-0! z-50! flex! items-center! justify-center! bg-bl! ```! ```ts! ack/80! p-4! backdrop-blur-md!"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative! flex! max-h-[90vh]! w-full! max-w-5xl! items-center! justify-center! overflow-hidden! rounded-2xl! border! border-zinc-800! bg-zinc-950! shadow-2xl!"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute! right-4! top-4! z-10! rounded-full! bg-black/60! p-2! text-white! transition-colors! hover:bg-black!"
              >
                <X className="h-5! w-5!" />
              </button>

              <img
                src={selectedImage}
                alt="Enlarged project view"
                className="h-full! max-h-[85vh]! w-full! object-contain!"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  ) : (
    /* Skeleton Loading State (Kept Intact for future use) */
    <LoadingScreen />
  );
}
