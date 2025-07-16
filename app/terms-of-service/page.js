"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "../../styles/globals.css";

const sections = [
  { id: "introduction", title: "1. Introduction" },
  { id: "usage", title: "2. Use of Services" },
  { id: "accounts", title: "3. User Accounts" },
  { id: "privacy", title: "4. Privacy Policy" },
  { id: "termination", title: "5. Termination" },
  { id: "changes", title: "6. Changes to Terms" },
  { id: "contact", title: "7. Contact Us" },
];

const content = {
  introduction: `Welcome to <b>JKTAGROCKET</b> 🚀. These Terms of Service ("Terms") govern your access to and use of our website and tools. By using our services, you agree to these Terms in full. If you do not agree, please do not use our platform.`,
  usage: `You may use our platform only in accordance with these Terms and all applicable laws. You may not misuse or interfere with our services or attempt unauthorized access. All tools provided are intended for professional ad tag validation and analysis only.`,
  accounts: `You may be required to provide accurate information to access certain features. You are responsible for maintaining the security of your credentials and for all activity under your account.`,
  privacy:
    `Your privacy is important to us. Please review our ` +
    `<a href="/privacy-policy/" style="color:#0070f3;text-decoration:underline;">Privacy Policy page</a>` +
    ` to understand how we collect, use, and protect your data. By using our services, you consent to our data practices.`,
  termination: `We may suspend or terminate your access at any time for violations of these Terms, abuse of services, or if required by law. Upon termination, you must cease all use of our platform.`,
  changes: `We may update these Terms occasionally. If we make material changes, we will notify you via email or on our website. Continued use of the service after changes means you accept the revised Terms.`,
  contact:
    `If you have questions about these Terms, please contact us via the ` +
    `<a href="/contact/" style="color:#0070f3;text-decoration:underline;">Contact page</a>` +
    ` or email us at 📨 <strong>support@jktagrocket.com</strong>.`,
};

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        threshold: 0.4,
        rootMargin: "0px 0px -50% 0px",
      }
    );

    const observed = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        observed.push(el);
      }
    });

    return () => {
      observed.forEach((el) => observer.unobserve(el));
    };
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
      {/* Sidebar TOC */}
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
        <h1 style={{ marginBottom: "1.5rem" }}>Terms of Service</h1>
        <p style={{ fontSize: "0.99rem", color: "#909", marginBottom: "2rem" }}>
          Last updated: <strong>July 2025</strong>
        </p>
        <p style={{ marginBottom: 24 }}>
          Please read these Terms of Service carefully before using our services.
        </p>

        {sections.map(({ id, title }) => (
          <section key={id} id={id} style={{ marginBottom: "2rem", scrollMarginTop: 120 }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>{title}</h2>
            <p
              style={{ lineHeight: "1.7", color: "#444" }}
              dangerouslySetInnerHTML={{ __html: content[id] }}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
