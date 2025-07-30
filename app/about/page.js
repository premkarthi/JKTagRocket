"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import "@/styles/globals.css";

const sections = [
  { id: "what-we-offer", title: "1. What We Offer" },
  { id: "why-we-built", title: "2. Why We Built This" },
  { id: "our-mission", title: "3. Our Mission" },
  { id: "who-its-for", title: "4. Who It&rsquo;s For" },
  { id: "contact", title: "5. Get in Touch" },
];

const fadeInStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: 0.4 }
    );

    const targets = document.querySelectorAll("section");
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        border: "2px solid #ccc",
        borderRadius: "10px",
        overflow: "hidden",
        margin: "2rem 1rem",
        minHeight: "100vh",
        scrollBehavior: "smooth",
      }}
    >
      {/* TOC */}
      <div
        style={{
          width: 260,
          background: "#f9f9f9",
          padding: 24,
          borderRight: "2px solid #ccc",
        }}
      >
        <div style={{ position: "sticky", top: 100 }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>On this page</h3>
          <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "1.6", margin: 0 }}>
            {sections.map(({ id, title }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`toc-link ${activeSection === id ? "active-toc" : ""}`}
                  style={{
                    color: activeSection === id ? "#000" : "#0070f3",
                    fontWeight: activeSection === id ? "bold" : "normal",
                    textDecoration: activeSection === id ? "underline" : "none",
                    display: "block",
                    padding: "4px 0",
                    transition: "color 0.3s",
                  }}
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        style={{ flex: 1, background: "#fff", padding: "24px" }}
        variants={fadeInStagger}
        initial="hidden"
        animate="show"
      >
        <motion.h1 variants={fadeInUp} style={{ marginBottom: "1.5rem" }}>
          About Us
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          style={{ fontSize: "1.1rem", lineHeight: "1.7", marginBottom: "24px" }}
        >
          <strong>JK Tag Rocket</strong> is a suite of professional tools built to simplify and supercharge display ad validation, instant HTML5 validation, native ad inspection, creative testing, and debugging across ad formats.
        </motion.p>

        {/* Section 1 */}
        <motion.section
          id="what-we-offer"
          variants={fadeInStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          style={{ marginBottom: "2rem", scrollMarginTop: "140px" }}
        >
          <motion.h2 variants={fadeInUp} style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
            1. What We Offer
          </motion.h2>
          <motion.ul
            variants={fadeInStagger}
            style={{ paddingLeft: "20px", lineHeight: "1.7", marginBottom: "20px" }}
          >
            {[
              "🚀 Instant display & HTML5 ad previewing",
              "🎯 Tracker & pixel detection with domain mapping",
              "📦 Asset analysis for GWD / AnimateCC / HTML5 zips",
              "🧠 Tag health scoring, performance timelines & JS error insights",
              "🌍 Geo-location simulation, GDPR/CCPA checks (coming soon)",
            ].map((item, index) => (
              <motion.li key={index} variants={fadeInUp}>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          id="why-we-built"
          variants={fadeInStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          style={{ marginBottom: "2rem", scrollMarginTop: "140px" }}
        >
          <motion.h2 variants={fadeInUp} style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
            2. Why We Built This
          </motion.h2>
          <motion.p variants={fadeInUp} style={{ fontSize: "1.05rem", lineHeight: "1.7" }}>
            Ad tech is complex. Developers often face slow feedback loops, unclear creative bugs, or inconsistent tag behavior across environments. We created JK Tag Rocket to solve these pain points with intuitive, modern tooling for faster debugging, testing, and learning.
          </motion.p>
        </motion.section>

        {/* Section 3 */}
        <motion.section
          id="our-mission"
          variants={fadeInStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          style={{ marginBottom: "2rem", scrollMarginTop: "140px" }}
        >
          <motion.h2 variants={fadeInUp} style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
            3. Our Mission
          </motion.h2>
          <motion.p variants={fadeInUp} style={{ fontSize: "1.05rem", lineHeight: "1.7" }}>
            Our mission is to empower every developer and marketer to ship ads that load fast, track cleanly, and comply confidently — without needing a full engineering team to debug basic issues.
          </motion.p>
        </motion.section>

        {/* Section 4 */}
        <motion.section
          id="who-its-for"
          variants={fadeInStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          style={{ marginBottom: "2rem", scrollMarginTop: "140px" }}
        >
          <motion.h2 variants={fadeInUp} style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
            4. Who It&rsquo;s For
          </motion.h2>
          <motion.ul
            variants={fadeInStagger}
            style={{ paddingLeft: "20px", lineHeight: "1.7", marginBottom: "20px" }}
          >
            {[
              "🧑‍💻 Developers & Ad Engineers",
              "🔍 QA & Tag Implementation Teams",
              "📈 Marketing Ops & Performance Analysts",
              "🎨 Creative Studios working on display assets",
            ].map((item, index) => (
              <motion.li key={index} variants={fadeInUp}>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        {/* Section 5 */}
        <motion.section
          id="contact"
          variants={fadeInStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          style={{ marginBottom: "2rem", scrollMarginTop: "140px" }}
        >
          <motion.h2 variants={fadeInUp} style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
            5. Get in Touch
          </motion.h2>
          <motion.p variants={fadeInUp} style={{ fontSize: "1.05rem", lineHeight: "1.7" }}>
            Have feedback, a bug to report, or want to partner with us?
            <br />
            Visit our{" "}
            <Link href="/contact" style={{ color: "#0070f3", textDecoration: "underline" }}>
              Contact Page
            </Link>
            .
          </motion.p>
        </motion.section>
      </motion.div>
    </div>
  );
}
