import { motion, type Variants } from "framer-motion";
import type { IAdditionalSection } from "../../../Model/Landing";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, x: -30 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 18,
    },
  },
};

const textContentVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 18,
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Image = function ({ data }: { data: IAdditionalSection }) {
  return (
    <motion.div
      variants={imageVariants}
      className="relative! shadow-2xl! shadow-white/10!  overflow-hidden! shrink-0!"
    >
      <motion.img
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-xl! h-[80vh]! rounded-lg object-cover! "
        src={data.image}
        alt={data.title || "Additional Section Image"}
      />
    </motion.div>
  );
};

const Text = function ({ data }: { data: IAdditionalSection }) {
  return (
    <motion.div
      variants={textContentVariants}
      className="text-xl! h-[50vh]! flex! flex-col! gap-10! text-white! max-w-xl!"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl! tracking-wide! uppercase! font-semibold! text-[#d1b797]! mb-3!">
          {data.title}
        </h1>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="w-24! h-[3px]! origin-left! rounded-full! bg-gradient-to-r! from-white! to-[#d1b797]!"
        />
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-white! text-[15px]! sm:text-[16px]! md:text-[18px]! lg:text-[19px]! font-light! leading-relaxed! tracking-wide!"
      >
        {data.text}
      </motion.p>
    </motion.div>
  );
};

export default function AdditionalSection({
  data,
  index,
  length,
}: {
  data: IAdditionalSection;
  index: number;
  length: number;
}) {
  return (
    <>
      {index % 2 == 0 ? (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className={`flex! min-h-screen! flex-col! ${length % 2 == 0 ? "bg-[#121212]" : "bg-[#0B0B0B]"}  md:flex-row! items-center! justify-center! gap-20! max-md:px-4!
`}
        >
          <Image data={data} />
          <Text data={data} />
        </motion.section>
      ) : (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className={`flex! min-h-screen! flex-col! ${length % 2 == 0 ? "bg-[#0B0B0B]" : " bg-[#121212]"}  md:flex-row! items-center! justify-center! gap-20! max-md:px-4!
`}
        >
          <Text data={data} />
          <Image data={data} />
        </motion.section>
      )}
    </>
  );
}
