"use client";

import React from "react";
import { motion } from "framer-motion";
import "../../styles/globals.css";

const sections = [
  { id: "data", title: "1. What Data We Collect" },
  { id: "usage", title: "2. How We Use Your Data" },
  { id: "cookies", title: "3. Cookies and Tracking" },
  { id: "security", title: "4. Data Security" },
  { id: "thirdparty", title: "5. Third-Party Services" },
  { id: "rights", title: "6. Your Rights" },
  { id: "contact", title: "7. Contact Us" },
];

const content = {
  data: `We may collect personal and usage data including IP addresses, browser types, and session behaviors. We also collect voluntarily submitted information such as email addresses when you contact us.`,
  usage: `Your data is used to improve our services, analyze traffic, and ensure security. We do not sell your personal information.`,
  cookies: `We use cookies and similar technologies to enhance your experience. You may disable cookies in your browser settings, but some features may not work as intended.`,
  security: `We implement security measures to protect your data, including encryption and regular system audits.`,
  thirdparty: `Some tools on our platform may interact with third-party services. These services have their own privacy policies.`,
  rights: `You may request to access, update, or delete your personal data by contacting us. We comply with GDPR and other regional laws where applicable.`,
  contact: `If you have questions about our Privacy Policy, contact us via the <a href="/contact/" style="color:#0070f3;text-decoration:underline;">Contact page</a> or email <strong>support@jktagrocket.com</strong>.`,
};

const fadeInStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div
      style={{
        display: "flex",
        border: "2px solid #ccc",
        borderRadius: "10px",
        margin: "2rem 1rem",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div style={{ width: 260, padding: 24, background: "#f9f9f9", borderRight: "2px solid #ccc" }}>
        <div style={{ position: "sticky", top: 100 }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>On this page</h3>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {sections.map(({ id, title }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  style={{
                    color: "#0070f3",
                    display: "block",
                    marginBottom: 8,
                    textDecoration: "none",
                  }}
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content */}
      <motion.div
        style={{ flex: 1, padding: 24, background: "#fff" }}
        variants={fadeInStagger}
        initial="hidden"
        animate="show"
      >
        <motion.h1 variants={fadeInUp} style={{ marginBottom: 20 }}>
          Privacy Policy
        </motion.h1>
        <motion.p variants={fadeInUp} style={{ color: "#909", marginBottom: 30 }}>
          Last updated: <strong>July 2025</strong>
        </motion.p>

        {sections.map(({ id, title }) => (
          <motion.section
            key={id}
            id={id}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInStagger}
            style={{ marginBottom: "2rem", scrollMarginTop: "140px" }}
          >
            <motion.h2 variants={fadeInUp} style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
              {title}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              style={{ lineHeight: "1.7", color: "#444" }}
              dangerouslySetInnerHTML={{ __html: content[id] }}
            />
          </motion.section>
        ))}
      </motion.div>
    </div>
  );
}
