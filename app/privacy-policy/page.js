// app/privacy-policy/page.js
"use client";

import React from "react";
import "@/styles/globals.css";



export default function PrivacyPolicyPage() {
  return (
    <div className="static-page-container" style={{ padding: "32px", maxWidth: "860px", margin: "0 auto" }}>
      <h1>Privacy Policy</h1>

      <p style={{ fontSize: "1.05rem", lineHeight: "1.7", marginBottom: "16px" }}>
        Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your information when you use our website and tools under the JK Tag Rocket platform.
      </p>

      <h2>1. Information We Collect</h2>
      <ul style={{ paddingLeft: "20px", lineHeight: "1.7" }}>
        <li><strong>Contact Information:</strong> When you submit forms (e.g., Contact), we may collect your name, email, phone number, and message content.</li>
        <li><strong>Usage Data:</strong> We may collect non-personal technical data like browser type, device type, IP address, and pages visited for analytics and performance improvements.</li>
        <li><strong>Files Uploaded:</strong> If you upload creative ZIPs or ad tags, we temporarily process them for previewing and analysis. We do not store user-uploaded content permanently.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul style={{ paddingLeft: "20px", lineHeight: "1.7" }}>
        <li>To respond to your support or contact inquiries</li>
        <li>To improve our services, tooling, and user experience</li>
        <li>To detect abuse or misuse of our platform</li>
      </ul>

      <h2>3. Data Retention</h2>
      <p style={{ fontSize: "1rem", lineHeight: "1.7" }}>
        We do not store uploaded creative files or ad tags after your session. Contact form submissions may be stored securely for record-keeping and response purposes.
      </p>

      <h2>4. Third-Party Services</h2>
      <p style={{ fontSize: "1rem", lineHeight: "1.7" }}>
        We may use third-party services like analytics providers or email processors. These providers are bound by their own privacy policies and do not receive your uploaded creative content.
      </p>

      <h2>5. Cookies</h2>
      <p style={{ fontSize: "1rem", lineHeight: "1.7" }}>
        Our site uses minimal cookies only for functionality or analytics. You may disable cookies in your browser settings, though some features may not work correctly.
      </p>

      <h2>6. Your Rights</h2>
      <p style={{ fontSize: "1rem", lineHeight: "1.7" }}>
        You may request access to, correction of, or deletion of your personal information by contacting us. We comply with applicable data privacy laws including GDPR and CCPA.
      </p>

      <h2>7. Updates</h2>
      <p style={{ fontSize: "1rem", lineHeight: "1.7" }}>
        We may update this Privacy Policy from time to time. The latest version will always be available on this page.
      </p>

      <h2>8. Contact</h2>
      <p style={{ fontSize: "1rem", lineHeight: "1.7" }}>
        For questions about this policy, please reach out via our <a href="/contact" style={{ color: "#0070f3", textDecoration: "underline" }}>Contact Page</a>.
      </p>

      <p style={{ fontSize: "0.95rem", color: "#555", marginTop: "40px" }}>
        Last updated: July 2025
      </p>
    </div>
  );
}
