import React from "react";
import Customtooltip from "components/Customtooltip";
import "@styles/TooltipcopyButton.css"; // Local import if scoped

export default function TooltipCopyButton({ value }) {
  const handleCopy = () => {
    if (value && value !== "NA") {
      navigator.clipboard.writeText(value);
    }
  };

  return (
    <button className="btn-copy" onClick={handleCopy}>
      📋
    </button>
  );
}
