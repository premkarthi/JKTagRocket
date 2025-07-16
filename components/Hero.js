"use client";

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
        padding: "48px 16px 24px", // less vertical space
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('/images/hero-bg.jpg') center/cover no-repeat",
        color: "#fff",
        textAlign: "center",
      }}
    >
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
            fontSize: "1.05rem",
            color: "#eee",
            marginBottom: "12px",
          }}
        >
          🚀 Professional Ad Tag Utilities
        </p>

        <div style={{ marginBottom: "16px" }}>
          <Image
            src="/images/logo.svg"
            alt="Logo middle"
            width={150}
            height={40}
            priority
          />
        </div>

        <p
          style={{
            fontSize: "1.1rem",
            color: "#f1f1f1",
            marginBottom: "24px",
            lineHeight: "1.6",
          }}
        >
          Professional ad tag utilities for previews, validation, and data transformation.
          Built for speed, precision, and developer productivity.
        </p>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <a
            href="https://jktagrocket.com/tools/display-ads/"
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
            href="/learn-more"
            style={{
              padding: "10px 22px",
              border: "2px solid #fff",
              color: "#fff",
              borderRadius: "6px",
              background: "transparent",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Learn More
          </a>
        </div>
      </motion.div>

      {/* 🔻 Animated Scroll Arrows */}
      <motion.div
        onClick={handleScroll}
        style={{
          position: "absolute",
          top: "calc(100% - 40px)", // places it near the bottom
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          zIndex: 10,
        }}
        title="Scroll down"
      >
        {[0, 1, 2].map((i) => (
          <motion.svg
            key={i}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff1493"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 2 }}
            transition={{
              delay: i * 0.15,
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        ))}
      </motion.div>
    </section>
  );
}
