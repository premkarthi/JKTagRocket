import React, { useState } from "react";
import "@styles/Customtooltip.css";

export default function Customtooltip({ text, children, variant }) {
  const [tooltipText, setTooltipText] = useState(text);
  const [showTooltip, setShowTooltip] = useState(false);

  const isAnimated = variant === "animated" || variant === "copy";

  const handleMouseEnter = () => {
    setTooltipText(text); // reset on re-hover
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setTooltipText(text);
    setShowTooltip(false);
  };

  const handleClick = () => {
    if (variant === "copy") {
      setTooltipText("Copied!");
      setShowTooltip(true);
      setTimeout(() => setTooltipText(text), 1500);
    }
  };

  return (
    <div
      className={`custom-tooltip-wrapper ${isAnimated ? "animated-tooltip" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {showTooltip && (
        <div className="tooltip-bubble">
          <div className="tooltip-text">{tooltipText}</div>
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
}


