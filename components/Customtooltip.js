"use client";
import React, { useState } from "react";
import "@styles/Customtooltip.css";

export default function Customtooltip({ text, children, variant }) {
  const [tooltipText, setTooltipText] = useState(text);
  const [showTooltip, setShowTooltip] = useState(false);

  const isCopy = variant === "copy";
  const isAnimated = variant === "animated";

  const handleMouseEnter = () => {
    setTooltipText(text);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setTooltipText(text);
    setShowTooltip(false);
  };

  const handleClick = () => {
    if (isCopy) {
      setTooltipText("Copied!");
      setShowTooltip(true);
      setTimeout(() => setTooltipText(text), 1500);
    }
    // no click effect for "animated"
  };

  return (
    <div
      className="custom-tooltip-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {showTooltip && (
        <div className={`tooltip-bubble ${isAnimated ? "animated" : ""}`}>
          <div className="tooltip-text">{tooltipText}</div>
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
}
