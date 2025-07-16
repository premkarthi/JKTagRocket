"use client";

import ToolsBar from "./ToolsBar";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  const handleScroll = () => {
    const el = document.getElementById("learn-more");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="hero"
      style={{
        position: "relative",
        padding: "60px 16px 40px",
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('/images/hero-bg.jpg') center/cover no-repeat",
        color: "#fff",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated Content */}
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 1rem",
        }}
      >
        <p
          className="tag"
          style={{
            fontSize: "1.1rem",
            color: "#eee",
            marginBottom: "16px",
          }}
        >
          🚀 Professional Ad Tag Utilities
        </p>

        <div style={{ marginBottom: "20px" }}>
          <Image
            src="/images/logo.svg"
            alt="Logo middle"
            width={150}
            height={40}
            priority
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>

        <p
          className="hero-description"
          style={{
            fontSize: "1.1rem",
            color: "#f1f1f1",
            marginBottom: "28px",
            lineHeight: "1.65",
          }}
        >
          Professional ad tag utilities for previews, validation, and data
          transformation. Built for speed, precision, and developer productivity.
        </p>

        <div
          className="hero-buttons"
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href="https://jktagrocket.com/tools/display-ads/"
            className="btn btn-primary"
            style={{
              padding: "10px 22px",
              backgroundColor: "#0070f3",
              color: "#fff",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Get Started
          </a>
          <a
            href="#learn-more"
            className="btn btn-outline"
            style={{
              padding: "10px 22px",
              border: "1px solid #fff",
              color: "#fff",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Learn More
          </a>
        </div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        onClick={handleScroll}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1.2,
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1,
        }}
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "pointer",
        }}
        title="Scroll down"
      >
        {/* Custom scroll icon - animated SVG arrow */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </section>
  );
}
