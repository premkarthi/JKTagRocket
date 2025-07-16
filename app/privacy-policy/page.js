"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "@/styles/globals.css";

const sections = [
  { id: "information", title: "1. Information We Collect" },
  { id: "usage", title: "2. How We Use Your Information" },
  { id: "retention", title: "3. Data Retention" },
  { id: "thirdparty", title: "4. Third-Party Services" },
  { id: "cookies", title: "5. Cookies" },
  { id: "rights", title: "6. Your Rights" },
  { id: "updates", title: "7. Updates" },
  { id: "contact", title: "8. Contact" },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("");
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: 0.3 }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    observerRef.current = observer;
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
      }}
    >
      {/* TOC Container */}
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
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          padding: "24px",
        }}
      >
        <h1 style={{ marginBottom: "1.5rem" }}>Privacy Policy</h1>
        <p style={{ fontSize: "0.99rem", color: "#909", marginBottom: "2rem" }}>
          Last updated: <strong>July 2025</strong>
        </p>
        <p style={{ marginBottom: 24 }}>
          This Privacy Policy outlines how we collect, use, and protect your information when you use our website and tools.
        </p>

        <section id="information" style={{ marginBottom: "2rem" }}>
          <h2>1. Information We Collect</h2>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.7" }}>
            <li><strong>Contact Information:</strong> When you submit forms (e.g., Contact), we may collect your name, email, phone number, and message content.</li>
            <li><strong>Usage Data:</strong> We may collect non-personal technical data like browser type, device type, IP address, and pages visited for analytics and performance improvements.</li>
            <li><strong>Files Uploaded:</strong> If you upload creative ZIPs or ad tags, we temporarily process them for previewing and analysis. We do not store user-uploaded content permanently.</li>
          </ul>
        </section>

        <section id="usage" style={{ marginBottom: "2rem" }}>
          <h2>2. How We Use Your Information</h2>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.7" }}>
            <li>To respond to your support or contact inquiries</li>
            <li>To improve our services, tooling, and user experience</li>
            <li>To detect abuse or misuse of our platform</li>
          </ul>
        </section>

        <section id="retention" style={{ marginBottom: "2rem" }}>
          <h2>3. Data Retention</h2>
          <p style={{ fontSize: "1rem", lineHeight: "1.7" }}>
            We do not store uploaded creative files or ad tags after your session. Contact form submissions may be stored securely for record-keeping and response purposes.
          </p>
        </section>

        <section id="thirdparty" style={{ marginBottom: "2rem" }}>
          <h2>4. Third-Party Services</h2>
          <p style={{ fontSize: "1rem", lineHeight: "1.7" }}>
            We may use third-party services like analytics providers or email processors. These providers are bound by their own privacy policies and do not receive your uploaded creative content.
          </p>
        </section>

        <section id="cookies" style={{ marginBottom: "2rem" }}>
          <h2>5. Cookies</h2>
          <p style={{ fontSize: "1rem", lineHeight: "1.7" }}>
            Our site uses minimal cookies only for functionality or analytics. You may disable cookies in your browser settings, though some features may not work correctly.
          </p>
        </section>

        <section id="rights" style={{ marginBottom: "2rem" }}>
          <h2>6. Your Rights</h2>
          <p style={{ fontSize: "1rem", lineHeight: "1.7" }}>
            You may request access to, correction of, or deletion of your personal information by contacting us. We comply with applicable data privacy laws including GDPR and CCPA.
          </p>
        </section>

        <section id="updates" style={{ marginBottom: "2rem" }}>
          <h2>7. Updates</h2>
          <p style={{ fontSize: "1rem", lineHeight: "1.7" }}>
            We may update this Privacy Policy from time to time. The latest version will always be available on this page.
          </p>
        </section>

        <section id="contact">
          <h2>8. Contact</h2>
          <p style={{ fontSize: "1rem", lineHeight: "1.7" }}>
            For questions about this policy, please reach out via our
            <a href="/contact" style={{ color: "#0070f3", textDecoration: "underline", marginLeft: 6 }}>Contact Page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
