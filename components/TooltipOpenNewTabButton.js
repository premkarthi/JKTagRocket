
"use client";
import React from "react";
import Image from "next/image";
import "@styles/TooltipOpenNewTabButton.css"; // Optional if you want custom styling



export default function TooltipOpenNewTabButton({ url }) {
  const handleClick = () => {
    if (!url || url === "NA" || url === "undefined") return;
    let openUrl = url.trim();
    if (!openUrl) return;

    if (openUrl.includes("redirectURL")) {
      const idx = openUrl.indexOf("redirectURL");
      openUrl = openUrl.substring(idx + "redirectURL".length + 1);
    }

    if (openUrl.startsWith("http")) {
      window.open(openUrl, "_blank");
    } else if (openUrl.includes("www") || openUrl.includes(".")) {
      window.open("https://" + openUrl, "_blank");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!url || url === "NA"}
      className="icon-button"
      style={{
        cursor: url && url !== "NA" ? "pointer" : "not-allowed",
        padding: 0,
        border: "none",
        background: "transparent",
      }}
    >
      <Image
        className="open-new-tab-icon"
        src="/images/open-new-tab.jpeg"
        alt="Click to open url in new tab"
        width={20}
        height={20}
        style={{ objectFit: "contain" }}
      />
    </button>
  );
}


