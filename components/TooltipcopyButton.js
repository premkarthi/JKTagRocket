import React from "react";
import Customtooltip from "components/Customtooltip";
import "@styles/TooltipcopyButton.css"; // Local import if scoped

// ✅ Fix: rename `value` to `text` for consistency
export default function TooltipCopyButton({ text }) {
  const handleCopy = () => {
    if (text && text !== "NA") {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <button className="btn-copy" onClick={handleCopy}>
      📋
    </button>
  );
}

