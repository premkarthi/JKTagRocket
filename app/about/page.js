"use client";

import React, { useEffect, useState, useRef } from "react";
import "@/styles/globals.css";

const sections = [
  { id: "what-we-offer", title: "1. What We Offer" },
  { id: "why-we-built", title: "2. Why We Built This" },
  { id: "our-mission", title: "3. Our Mission" },
  { id: "who-its-for", title: "4. Who It's For" },
  { id: "contact", title: "5. Get in Touch" },
];

export default function AboutPage() {
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
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, background: "#fff", padding: "24px" }}>
        <h1 style={{ marginBottom: "1.5rem" }}>About Us</h1>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.7", marginBottom: "24px" }}>
          <strong>JK Tag Rocket</strong> is a suite of professional tools built to simplify and supercharge display ad validation, instant HTML5 validation, native ad inspection, creative testing, and debugging across ad formats.
        </p>

        <section id="what-we-offer" style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>1. What We Offer</h2>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.7", marginBottom: "20px" }}>
            <li>🚀 Instant display & HTML5 ad previewing</li>
            <li>🎯 Tracker & pixel detection with domain mapping</li>
            <li>📦 Asset analysis for GWD / AnimateCC / HTML5 zips</li>
            <li>🧠 Tag health scoring, performance timelines & JS error insights</li>
            <li>🌍 Geo-location simulation, GDPR/CCPA checks (coming soon)</li>
          </ul>
        </section>

        <section id="why-we-built" style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>2. Why We Built This</h2>
          <p style={{ fontSize: "1.05rem", lineHeight: "1.7" }}>
            Ad tech is complex. Developers often face slow feedback loops, unclear creative bugs, or inconsistent tag behavior across environments. We created JK Tag Rocket to solve these pain points with intuitive, modern tooling for faster debugging, testing, and learning.
          </p>
        </section>

        <section id="our-mission" style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>3. Our Mission</h2>
          <p style={{ fontSize: "1.05rem", lineHeight: "1.7" }}>
            Our mission is to empower every developer and marketer to ship ads that load fast, track cleanly, and comply confidently — without needing a full engineering team to debug basic issues.
          </p>
        </section>

        <section id="who-its-for" style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>4. Who It's For</h2>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.7", marginBottom: "20px" }}>
            <li>🧑‍💻 Developers & Ad Engineers</li>
            <li>🔍 QA & Tag Implementation Teams</li>
            <li>📈 Marketing Ops & Performance Analysts</li>
            <li>🎨 Creative Studios working on display assets</li>
          </ul>
        </section>

        <section id="contact" style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>5. Get in Touch</h2>
          <p style={{ fontSize: "1.05rem", lineHeight: "1.7" }}>
            Have feedback, a bug to report, or want to partner with us?
            <br />
            Visit our <a href="/contact" style={{ color: "#0070f3", textDecoration: "underline" }}>Contact Page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
