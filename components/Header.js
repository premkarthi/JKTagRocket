"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import DarkModeToggle from './DarkModeToggle';

export default function Header() {
  const pathname = usePathname();
  const isActive = (href) => pathname === href || pathname === href + "/";

  return (
    <header
      className="header"
      style={{
        borderBottom: "1px solid #ddd",
        padding: "8px 0",
        background: "#fff",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 16px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Ad Banner */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Link href="https://jktagrocket.com/tools/video-validator/" target="_blank">
            <Image
              src="/images/728x90-bottomallapges.jpg"
              alt="Bottom Ad"
              width={728}
              height={90}
            />
          </Link>
          {/* <Link href="https://jktagrocket.com/tools/html5-validator/" target="_blank">
            <Image
              src="/images/970x90-topheader.jpg"
              alt="Top Ad Banner"
              width={970}
              height={90}
              priority
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Link> */}
        </div>

        {/* Navigation */}
        <nav
          className="nav"
          style={{
            display: "flex",
            gap: "24px",
            fontSize: "0.95rem",
            fontWeight: 500,
          }}
        >
          <Link
            href="/"
            className={isActive("/") ? "active" : ""}
            style={{
              color: isActive("/") ? "#000" : "#0070f3",
              textDecoration: isActive("/") ? "underline" : "none",
              transition: "color 0.2s",
            }}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={isActive("/about") ? "active" : ""}
            style={{
              color: isActive("/about") ? "#000" : "#0070f3",
              textDecoration: isActive("/about") ? "underline" : "none",
              transition: "color 0.2s",
            }}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={isActive("/contact") ? "active" : ""}
            style={{
              color: isActive("/contact") ? "#000" : "#0070f3",
              textDecoration: isActive("/contact") ? "underline" : "none",
              transition: "color 0.2s",
            }}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
