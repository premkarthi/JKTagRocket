"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerList = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const listItemFade = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function LearnMorePage() {
  const features = [
    "✅ Display Ad Validator: Paste ad tags and preview instantly with size detection, tracker mapping, and real network logging.",
    "✅ HTML5 Validator: Upload zipped HTML5 banners and validate creative assets, JS errors, and missing files.",
    "✅ Video & Native Validators: Preview complex formats and debug macros, trackers, and media performance.",
    "✅ Tag Intelligence: See real-time performance timelines, JS console errors, GDPR/CCPA compliance, and more.",
    "✅ Privacy & Geo Testing: Simulate from different regions and check CMP frameworks (coming soon).",
  ];

  return (
    <main
      style={{
        padding: "2rem 1rem",
        background: "#f9f9f9",
        borderTop: "2px solid #ddd",
        borderBottom: "2px solid #ddd",
        fontSize: "1rem",
        lineHeight: "1.6",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Title */}
        <motion.h1
          style={{ fontSize: "2rem", marginBottom: "1.2rem" }}
          initial="hidden"
          animate="show"
          variants={fadeInUp}
        >
          Why Choose JK Tag Rocket?
        </motion.h1>

        {/* Intro paragraph */}
        <motion.p
          style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}
          initial="hidden"
          animate="show"
          variants={fadeInUp}
        >
          <strong>JK Tag Rocket</strong> is a powerful toolkit for developers, QA engineers,
          ad ops, and marketers who need to preview, debug, validate, and analyze ad tags and creatives—fast.
        </motion.p>

        {/* List of features */}
        <motion.ul
          style={{ paddingLeft: "20px", fontSize: "1.05rem", marginBottom: "1.5rem" }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerList}
        >
          {features.map((item, i) => (
            <motion.li key={i} variants={listItemFade} style={{ marginBottom: "10px" }}>
              {item}
            </motion.li>
          ))}
        </motion.ul>

        {/* Final description */}
        <motion.p
          style={{ fontSize: "1.05rem", marginBottom: "1.5rem" }}
          initial="hidden"
          animate="show"
          variants={fadeInUp}
        >
          Whether you’re testing Google AdSense, GAM, or custom networks, JK Tag Rocket
          gives you developer-grade tools in a clean, modern interface—no browser extensions
          or extra setup required.
        </motion.p>

        {/* CTA: Browse All Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          style={{
            padding: "1rem 1.5rem",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            Ready to validate your ad tags?
          </p>
          <Link
            href="/"
            style={{
              backgroundColor: "#0070f3",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: "1rem",
              display: "inline-block",
            }}
          >
            Browse All Tools →
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
