import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  Bed,
  Folder,
  Home,
  Image as ImageIcon,
  Layers,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  Ruler,
  Tag,
  X,
} from "lucide-react";

import { useParams } from "react-router";

import { useEffect, useState } from "react";
import { useContactInfo } from "./useContactInfo";
// Import House model type & custom Hook
import { type House } from "../../Model/IHouse";
import { useHouse } from "./useHouses";

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const ContactInfo = function () {
  const Contact = useContactInfo();

  useEffect(() => {
    Contact.GetData();
  }, []);

  return (
    <div className="flex! flex-col! gap-6!">
      <div className="flex! w-full! items-center! justify-center!">
        {Contact.loading ? (
          <div className="w-full! animate-pulse! rounded-md! bg-slate-200! dark:bg-slate-800!"></div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="flex! flex-col! gap-[12px]! rounded-xl! bg-transparent! px-[10px]! py-[4px]! md:flex-row! md:border! md:border-white/[0.1]! md:bg-transparent! "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.4 }}
            style={{
              width: "100%",
              maxWidth: "950px",

              alignItems: "center",
              fontFamily: "'Inter', Arial, sans-serif",

              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",

              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              style={{
                flex: 1,
                padding: "20px 0px 20px 50px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* ----------------------addresses--------------------------- */}

              <div className="flex! flex-col! gap-6! py-2! font-sans! tracking-wide!">
                {/* ---------------------- ADDRESSES --------------------------- */}

                {/* ---------------------- EMAILS --------------------------- */}
                <motion.div
                  variants={itemVariants}
                  className="group! flex! flex-col! gap-2.5!"
                >
                  <div className="flex! items-center! gap-2.5!">
                    <div className="flex! h-8! w-8! items-center! justify-center! rounded-lg! border! border-[#D4B273]/30! bg-[#D4B273]/10! text-[#D4B273]! shadow-sm! backdrop-blur-md! transition-colors! group-hover:border-[#D4B273]/60! group-hover:bg-[#D4B273]/20!">
                      <Mail className="h-4! w-4!" />
                    </div>
                    <span className="bg-gradient-to-r! from-[#FFF2E1]! to-[#D8A976]! bg-clip-text! text-xs! font-bold! uppercase! tracking-widest! text-transparent! drop-shadow-sm!">
                      Emails
                    </span>
                  </div>

                  <div className="flex! flex-col! gap-1.5! ps-10! text-sm! font-normal! leading-relaxed! text-zinc-200!">
                    {Contact.data?.data?.[0].emails &&
                    Contact.data?.data?.[0].emails.length > 0 ? (
                      Contact.data?.data?.[0].emails.map(
                        (email: string, idx: number) => (
                          <a
                            key={idx}
                            href={`mailto:${email}`}
                            className="w-fit! transition-colors! hover:text-[#D8A976]! hover:underline!"
                          >
                            {email}
                          </a>
                        ),
                      )
                    ) : (
                      <p className="italic! text-zinc-500!">
                        No email provided
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* ---------------------- NUMBERS --------------------------- */}
                <motion.div
                  variants={itemVariants}
                  className="group! flex! flex-col! gap-2.5!"
                >
                  <div className="flex! items-center! gap-2.5!">
                    <div className="flex! h-8! w-8! items-center! justify-center! rounded-lg! border! border-[#D4B273]/30! bg-[#D4B273]/10! text-[#D4B273]! shadow-sm! backdrop-blur-md! transition-colors! group-hover:border-[#D4B273]/60! group-hover:bg-[#D4B273]/20!">
                      <Phone className="h-4! w-4!" />
                    </div>
                    <span className="bg-gradient-to-r! from-[#FFF2E1]! to-[#D8A976]! bg-clip-text! text-xs! font-bold! uppercase! tracking-widest! text-transparent! drop-shadow-sm!">
                      Phone Numbers
                    </span>
                  </div>

                  <div className="dir-ltr! flex! flex-col! gap-1.5! ps-10! text-sm! font-normal! leading-relaxed! text-zinc-200!">
                    {Contact.data?.data?.[0].numbers &&
                    Contact.data?.data?.[0].numbers.length > 0 ? (
                      Contact.data?.data?.[0].numbers.map(
                        (num: string, idx: number) => (
                          <a
                            key={idx}
                            href={`tel:${num}`}
                            className="w-fit! font-mono! text-sm! tracking-wider! transition-colors! hover:text-[#D8A976]! hover:underline!"
                          >
                            {num}
                          </a>
                        ),
                      )
                    ) : (
                      <p className="italic! text-zinc-500!">
                        No numbers provided
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
              {/* ------------------------------------------------- */}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- Framer Motion Animation Variants ---
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

export default function ShowHouse() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const houseHook = useHouse();
  const { houseId } = useParams<{ houseId: string }>();

  useEffect(() => {
    if (houseId) houseHook.getOne({ id: houseId });
  }, [houseId]);

  const oneHouse: House | null = houseHook.oneHouse;
  const hasGalleryImages = oneHouse?.images && oneHouse.images.length > 0;

  return !houseHook.loading ? (
    <>
      <div className="bg-white! px-4! py-24! text-black! selection:bg-[#d1b797]! selection:text-black! dark:bg-[#0d0d0d]! dark:text-zinc-100! md:px-12!">
        {/* Main Content Area */}
        <motion.main
          className="mx-auto! mb-20! flex! max-w-7xl! flex-col! gap-16!"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section: Main Cover Image & Property Overview */}
          <div className="flex! w-full! flex-col! items-start! gap-12! lg:flex-row!">
            {/* Left Column: Hero Cover Image Card */}
            <motion.div
              className="w-full! lg:w-[45%]! lg:min-w-[420px]!"
              variants={scaleIn}
            >
              <div className="group! relative! h-[76vh]! overflow-hidden! rounded-2xl! border! border-gray-100! bg-gray-100! shadow-2xl! dark:border-zinc-800! dark:bg-zinc-900!">
                <img
                  src={oneHouse?.mainImage}
                  alt={oneHouse?.title}
                  className="w-full! object-cover! object-center! transition-transform! duration-700! ease-out! group-hover:scale-105!"
                />
                <div className="absolute! inset-0! bg-gradient-to-t! from-black/80! via-black/20! to-transparent!" />

                {/* Top Corner Property Type Badge */}
                {oneHouse?.houseType?.name && (
                  <div className="absolute! left-4! top-4!">
                    <span className="inline-flex! items-center! gap-1.5! rounded-full! border! border-[#d1b797]/40! bg-[#d1b797]/20! px-3.5! py-1! text-xs! font-semibold! uppercase! tracking-wider! text-[#000]! backdrop-blur-md!">
                      <Folder className="h-3.5! w-3.5!" />
                      {oneHouse.houseType.name}
                    </span>
                  </div>
                )}

                {/* Bottom Corner Expand Action */}
                <div className="absolute! bottom-4! right-4!">
                  <button
                    onClick={() =>
                      setSelectedImage(oneHouse?.mainImage ?? null)
                    }
                    className="flex! items-center! gap-2! rounded-xl! border! border-white/20! bg-black/60! px-3.5! py-2! text-xs! font-medium! text-white! backdrop-blur-md! transition-all! hover:bg-black/80!"
                  >
                    <Maximize2 className="h-3.5! w-3.5! text-[#d1b797]!" />
                    <span>Expand Cover</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Title, Property Details & Specifications */}
            <motion.div
              className="flex! grow! flex-col! justify-center!"
              variants={fadeInUp}
            >
              <div className="mb-6!">
                <span className="mb-2! block! text-xs! font-semibold! uppercase! tracking-widest! text-[#d1b797]!">
                  Real Estate Showcase
                </span>
                <h1 className="mb-4! text-3xl! font-semibold! tracking-wide! text-[#18181B]! dark:text-white! md:text-5xl!">
                  {oneHouse?.title}
                </h1>
              </div>

              {/* Property Specs Grid Card */}
              <div className="mb-6! grid! grid-cols-2! gap-4! rounded-xl! border! border-gray-100! bg-zinc-900/5! p-6! backdrop-blur-sm! dark:border-zinc-800/80! dark:bg-zinc-900/60! sm:grid-cols-3!">
                {/* Property Type */}
                <div>
                  <span className="mb-1! block! text-xs! uppercase! tracking-wider! text-zinc-700! dark:text-zinc-500!">
                    Property Type
                  </span>
                  <div className="flex! items-center! gap-1.5! text-sm! font-medium! text-zinc-900! dark:text-zinc-200!">
                    <Home className="h-4! w-4! text-[#d1b797]!" />
                    <span>{oneHouse?.houseType?.name || "-"}</span>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <span className="mb-1! block! text-xs! uppercase! tracking-wider! text-zinc-700! dark:text-zinc-500!">
                    City & Location
                  </span>
                  <div className="flex! items-center! gap-1.5! text-sm! font-medium! text-zinc-900! dark:text-zinc-200!">
                    <MapPin className="h-4! w-4! text-[#d1b797]!" />
                    <span>
                      {oneHouse?.city
                        ? `${oneHouse.city}, ${oneHouse.location}`
                        : "-"}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <span className="mb-1! block! text-xs! uppercase! tracking-wider! text-zinc-700! dark:text-zinc-500!">
                    Price
                  </span>
                  <div className="flex! items-center! gap-1.5! text-sm! font-medium! text-zinc-900! dark:text-zinc-200!">
                    <Tag className="h-4! w-4! text-[#d1b797]!" />
                    <span>
                      {oneHouse?.price ? `$${oneHouse.price}` : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Area */}
                <div>
                  <span className="mb-1! block! text-xs! uppercase! tracking-wider! text-zinc-700! dark:text-zinc-500!">
                    Total Area
                  </span>
                  <div className="flex! items-center! gap-1.5! text-sm! font-medium! text-zinc-900! dark:text-zinc-200!">
                    <Ruler className="h-4! w-4! text-[#d1b797]!" />
                    <span>{oneHouse?.area ? `${oneHouse.area} m²` : "-"}</span>
                  </div>
                </div>

                {/* Rooms Count */}
                <div>
                  <span className="mb-1! block! text-xs! uppercase! tracking-wider! text-zinc-700! dark:text-zinc-500!">
                    Rooms Count
                  </span>
                  <div className="flex! items-center! gap-1.5! text-sm! font-medium! text-zinc-900! dark:text-zinc-200!">
                    <Bed className="h-4! w-4! text-[#d1b797]!" />
                    <span>{oneHouse?.roomsCount ?? "-"}</span>
                  </div>
                </div>

                {/* Courtyard Feature */}
              </div>
              <ContactInfo />
            </motion.div>
          </div>

          {/* Section 2: Detailed Description */}
          {oneHouse?.description && (
            <motion.section className="h-fit!" variants={fadeInLeft}>
              <div className="mb-4! flex! items-center! gap-4!">
                <h3 className="flex! items-center! gap-2! text-xl! uppercase! tracking-wider! text-[#18181B]! dark:font-semibold! dark:text-white!">
                  <Layers className="h-5! w-5! text-[#d1b797]!" />
                  Property Description & Details
                </h3>
                <div className="h-px! flex-1! bg-zinc-600! dark:bg-zinc-800!" />
              </div>

              <div className="rounded-xl! border! border-gray-300! bg-white! p-6! transition-colors! dark:border-zinc-800/80! dark:bg-zinc-900/40!">
                <p className="whitespace-pre-line! text-sm! leading-relaxed! text-zinc-700! dark:text-zinc-300! md:text-base!">
                  {oneHouse.description}
                </p>
              </div>
            </motion.section>
          )}

          {/* Section 3: Property Photo Gallery */}
          {hasGalleryImages && (
            <motion.section className="pb-18! h-fit!" variants={fadeInUp}>
              <div className="mb-6! flex! items-center! gap-4!">
                <h3 className="flex! items-center! gap-2! text-xl! uppercase! tracking-wider! text-[#18181B]! dark:font-semibold! dark:text-white!">
                  <ImageIcon className="h-5! w-5! text-[#d1b797]!" />
                  Property Gallery ({oneHouse.images.length})
                </h3>
                <div className="h-px! flex-1! bg-zinc-600! dark:bg-zinc-800!" />
              </div>

              {/* Gallery Grid */}
              <div className="grid! grid-cols-1! gap-4! sm:grid-cols-2! md:grid-cols-3! lg:grid-cols-4!">
                {oneHouse.images.map((imgUrl, index) => (
                  <motion.div
                    key={`house-img-${index}`}
                    whileHover={{ scale: 1.03 }}
                    className="group! relative! aspect-video! cursor-pointer! overflow-hidden! rounded-xl! border! border-gray-200! bg-gray-100! shadow-sm! dark:border-zinc-800! dark:bg-zinc-900!"
                    onClick={() => setSelectedImage(imgUrl)}
                  >
                    <img
                      src={imgUrl}
                      alt={`House view ${index + 1}`}
                      className="h-full! w-full! object-cover! transition-transform! duration-500! group-hover:scale-105!"
                    />
                    <div className="absolute! inset-0! flex! items-center! justify-center! bg-black/40! opacity-0! transition-opacity! group-hover:opacity-100!">
                      <Maximize2 className="h-5! w-5! text-white!" />
                    </div>
                  </motion.div>
                ))}
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
            className="fixed! inset-0! z-50! flex! items-center! justify-center! bg-black/80! p-4! backdrop-blur-md!"
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
                alt="Enlarged property view"
                className="h-full! max-h-[85vh]! w-full! object-contain!"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  ) : (
    /* Skeleton Loading State */
    <div className="p-12!">
      <div className="mb-10! h-14! w-full! animate-pulse! rounded-sm! bg-slate-200! dark:bg-slate-800!" />
      <div className="mb-10! grid! grid-cols-2! gap-6!">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-80! w-full! animate-pulse! rounded-sm! bg-slate-200! dark:bg-slate-800!"
          />
        ))}
      </div>
      <div className="mb-10! h-14! w-full! animate-pulse! rounded-sm! bg-slate-200! dark:bg-slate-800!" />
    </div>
  );
}
