import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { motion, type Variants } from "framer-motion";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ==========================================
// FRAMER MOTION VARIANTS
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Time between each item animating in
      delayChildren: 0.3, // Wait slightly for the GSAP scroll snap to settle
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, // Smooth easing
  },
};

const SignatureSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // ==========================================
  // GSAP SCROLL SNAP LOGIC
  // ==========================================

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#121212",
        overflow: "hidden",
      }}
    >
      {/* 
        Main Container is now a motion.div
        whileInView triggers the "visible" animation state when on screen 
      */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }} // Triggers when 40% of section is visible
        style={{
          width: "100%",
          maxWidth: "650px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          fontFamily: "'Inter', Arial, sans-serif",
        }}
      >
        {/* LEFT COLUMN: Logo */}
        <motion.div
          variants={itemVariants}
          style={{
            padding: "0px 30px 0px 0",
            width: "220px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <img
            src="https://aaran-co.com/email_assets/logopattern3.svg"
            alt="Logo"
            width="217"
            height="250"
          />
        </motion.div>

        {/* MIDDLE COLUMN: Vertical Gold Divider */}
        <motion.div
          variants={itemVariants}
          style={{
            width: "1px",
            padding: "30px 0px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <img
            src="https://aaran-co.com/email_assets/divider2.svg"
            alt="Divider"
            height="180"
          />
        </motion.div>

        {/* RIGHT COLUMN: Details */}
        <div
          style={{
            flex: 1,
            padding: "30px 30px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Name */}
          <motion.div
            variants={itemVariants}
            style={{
              fontFamily: "'Inter', Arial, Helvetica, sans-serif",
              fontSize: "30px",
              color: "#D4B273",
              background: "linear-gradient(to left, #fff2e1 0%, #d8a976 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 600,
              paddingBottom: "2px",
              lineHeight: 1.1,
              textShadow: "0px 2.85px 13.39px rgba(0, 0, 0, 0.30)",
            }}
          >
            Roaa Baba
          </motion.div>

          {/* Title & Phone */}
          <motion.div
            variants={itemVariants}
            style={{
              fontFamily: "'Inter', Arial, Helvetica, sans-serif",
              fontSize: "15px",
              color: "#b3b3b3",
              paddingBottom: "18px",
              lineHeight: 1.4,
              textShadow: "0px 2.85px 13.39px rgba(0, 0, 0, 0.60)",
            }}
          >
            Architectural Engineer, +963 9562 156 88
          </motion.div>

          {/* Address 1 */}
          <motion.div
            variants={itemVariants}
            style={{
              fontFamily: "'Inter', Arial, Helvetica, sans-serif",
              fontSize: "14px",
              color: "#f5f5f5",
              paddingBottom: "8px",
              lineHeight: 1.5,
              textShadow: "0px 2.85px 13.39px rgba(0, 0, 0, 0.60)",
            }}
          >
            <span
              style={{
                color: "#D4B273",
                background:
                  "linear-gradient(to left, #fff2e1 0%, #d8a976 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Address 1 :
            </span>{" "}
            Syria, Aleppo, Al-Mogambo nighborhood, +963956215688
          </motion.div>

          {/* Address 2 */}
          <motion.div
            variants={itemVariants}
            style={{
              fontFamily: "'Inter', Arial, Helvetica, sans-serif",
              fontSize: "14px",
              color: "#f5f5f5",
              paddingBottom: "8px",
              lineHeight: 1.5,
              textShadow: "0px 2.85px 13.39px rgba(0, 0, 0, 0.60)",
            }}
          >
            <span
              style={{
                color: "#D4B273",
                background:
                  "linear-gradient(to left, #fff2e1 0%, #d8a976 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Address 2 :
            </span>{" "}
            Egypt, Cairo, Al-Obbur city, 00201200020582
          </motion.div>

          {/* Website */}
          <motion.div
            variants={itemVariants}
            style={{
              fontFamily: "'Inter', Arial, Helvetica, sans-serif",
              fontSize: "14px",
              color: "#b3b3b3",
              textShadow: "0px 2.85px 13.39px rgba(0, 0, 0, 0.60)",
            }}
          >
            <span
              style={{
                color: "#D4B273",
                background:
                  "linear-gradient(to left, #fff2e1 0%, #d8a976 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              website:
            </span>{" "}
            <a
              href="http://aaran-co.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#b3b3b3", textDecoration: "none" }}
            >
              aaran-co.com
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default SignatureSection;
