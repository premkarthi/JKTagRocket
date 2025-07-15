// app/about/page.js
"use client";

import React from "react";
import "@/styles/globals.css";

export default function AboutPage() {
  return (
    <div className="static-page-container" style={{ padding: "32px", maxWidth: "860px", margin: "0 auto" }}>
      <h1>About Us</h1>
      <p style={{ fontSize: "1.1rem", lineHeight: "1.7", marginBottom: "20px" }}>
        <strong>JK Tag Rocket</strong> is a suite of professional tools built to simplify and supercharge display ad validation,Instant HTML5 Validation & Built for Developers,Native Ad Inspector & Creative Preview tag testing,Test video ad tags(VAST/VPAID) with comprehensive performance analytics, Transform and manipulate ad data with powerful utilities using Data tools and creative troubleshooting for different ad formats . We empower developers, marketers, and QA teams to launch faster, with confidence.
      </p>

      <h2>What We Offer</h2>
      <ul style={{ paddingLeft: "20px", lineHeight: "1.7", marginBottom: "20px" }}>
        <li>🚀 Instant display & HTML5 ad previewing</li>
        <li>🎯 Tracker & pixel detection with domain mapping</li>
        <li>📦 Asset analysis for GWD / AnimateCC / HTML5 zips</li>
        <li>🧠 Tag health scoring, performance timelines & JS error insights</li>
        <li>🌍 Geo-location simulation, GDPR/CCPA checks (coming soon)</li>
      </ul>

      <h2>Why We Built This</h2>
      <p style={{ fontSize: "1.05rem", lineHeight: "1.7" }}>
        Ad tech is complex. Developers often face slow feedback loops, unclear creative bugs, or inconsistent tag behavior across environments. We created JK Tag Rocket to solve these pain points with intuitive, modern tooling for faster debugging, testing, and learning.
      </p>

      <h2 style={{ marginTop: "32px" }}>Our Mission</h2>
      <p style={{ fontSize: "1.05rem", lineHeight: "1.7" }}>
        Our mission is to empower every developer and marketer to ship ads that load fast, track cleanly, and comply confidently — without needing a full engineering team to debug basic issues.
      </p>

      <h2 style={{ marginTop: "32px" }}>Who It's For</h2>
      <ul style={{ paddingLeft: "20px", lineHeight: "1.7", marginBottom: "20px" }}>
        <li>🧑‍💻 Developers & Ad Engineers</li>
        <li>🔍 QA & Tag Implementation Teams</li>
        <li>📈 Marketing Ops & Performance Analysts</li>
        <li>🎨 Creative Studios working on display assets</li>
      </ul>

      <h2 style={{ marginTop: "32px" }}>Get in Touch</h2>
      <p style={{ fontSize: "1.05rem", lineHeight: "1.7" }}>
        Have feedback, a bug to report, or want to partner with us?
        <br />
        Visit our <a href="/contact" style={{ color: "#0070f3", textDecoration: "underline" }}>Contact Page</a>.
      </p>
    </div>
  );
}
