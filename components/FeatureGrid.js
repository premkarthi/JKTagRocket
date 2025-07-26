'use client';

import React from "react";
import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";
import ToolUpdatesBanner from "./ToolUpdatesBanner";


const features = [
  {
    title: "🧩 Display Ads",
    description:
      "Preview and validate Google AdSense display ad tags with real-time rendering and comprehensive testing.",
    ctaText: "Try now",
    path: "/tools/display-ads",
  },
  {
    title: "📄 HTML5 Validator",
    description:
      "Upload and validate HTML5 ad creative files with comprehensive error reporting and syntax checking.",
    ctaText: "Try now",
    path: "/tools/html5-validator",
  },
  {
    title: "📹 Video Validator",
    description:
      "Preview and validate Google AdSense video ad tags with real-time rendering and testing.",
    ctaText: "Try now",
    path: "/tools/video-validator",
  },
  {
    title: "🧱 Native Ads",
    description:
      "Create and preview native ad formats with customizable layouts and responsive design testing.",
    ctaText: "Try now",
    path: "/tools/native-ads",
  },
  {
    title: "🛠️ Data Tools",
    description:
      "Transform and manipulate ad data formats with advanced processing tools and utilities.",
    ctaText: "Try now",
    path: "/tools/data-tools",
  },
];

// Stagger animation for cards
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Heading animation
const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function FeatureGrid() {
  return (
    <section
      style={{
        padding: "60px 20px",
        backgroundColor: "#fafafa",
        border: "2px solid #e0e0e0",
        borderRadius: "12px",
        margin: "2rem 1rem",
      }}
    >
      <ToolUpdatesBanner />
      <motion.h2
        variants={headingVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        style={{
          textAlign: "center",
          fontSize: "1.7rem",
          marginBottom: "30px",
          fontWeight: 555,
          color: "#222",
        }}
      >
        🔧 Explore Our Ad Tools
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "32px",
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ rotateX: 4, rotateY: -4, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 150, damping: 10 }}
            style={{
              transformStyle: "preserve-3d",
              perspective: 1000,
              willChange: "transform",
            }}
          >
            <FeatureCard {...feature} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
