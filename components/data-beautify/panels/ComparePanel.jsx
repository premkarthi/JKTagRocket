"use client";
import React, { useState } from "react";
import styles from "../../../app/tools/display-ads/DisplayAds.module.css"; // or wherever your buttons styles live
import "../../../styles/globals.css"; // make sure this includes the .user-message CSS
import '../../../styles/databeautifytools.css';
import { useAutoDismissMessage, getIcon } from "../../../components/useMessages";


export default function ComparePanel() {
  const [primaryText, setPrimaryText] = useState("");
  const [secondaryText, setSecondaryText] = useState("");
  const [message, setMessage] = useState(null); // { text: "", type: "success" | "error" | ... }

  const handleCompare = () => {
    if (!primaryText.trim() || !secondaryText.trim()) {
      setMessage({
        type: "warning",
        text: "⚠️ Please enter both inputs to compare data.",
      });
      return;
    }

    const primaryLines = primaryText.trim().split("\n");
    const secondaryLines = secondaryText.trim().split("\n");
    const maxLength = Math.max(primaryLines.length, secondaryLines.length);
    const result = [];

    for (let i = 0; i < maxLength; i++) {
      const a = primaryLines[i] || "";
      const b = secondaryLines[i] || "";
      if (a !== b) {
        result.push(
          `🔴 Line ${i + 1} differs:\n→ Primary: ${a}\n→ Secondary: ${b}\n`
        );
      }
    }

    if (result.length === 0) {
      setMessage({
        type: "success",
        text: "✅ Both inputs are identical.",
      });
    } else {
      setMessage({
        type: "error",
        text: result.join("\n"),
      });
    }
  };

  const handleReset = () => {
    setPrimaryText("");
    setSecondaryText("");
    setMessage(null);
  };

  return (
    <div className="dataBeautifyPanel">
      <div className="dataBeautifyPanelTitle">
        <span className="dataBeautifyPanelTitleIcon">🔀</span>
        Comparing Data
      </div>

      <textarea
        className="dataBeautifyTextarea"
        placeholder="Paste your primary data ....!!!"
        rows={6}
        value={primaryText}
        onChange={(e) => setPrimaryText(e.target.value)}
        style={{ marginBottom: "12px" }}
      />

      <textarea
        className="dataBeautifyTextarea"
        placeholder="Paste your secondary data ....!!!"
        rows={6}
        value={secondaryText}
        onChange={(e) => setSecondaryText(e.target.value)}
        style={{ marginBottom: "16px" }}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <button
          type="button"
          className={styles.displayAdsResetBtn}
          onClick={handleReset}
        >
          🔄 Reset
        </button>
        <button
          type="button"
          className={styles.displayAdsPreviewBtn}
          onClick={handleCompare}
        >
          Compare
        </button>
      </div>

      {message && (
        <div
          className={`user-message ${message.type}`}
          style={{ whiteSpace: "pre-wrap" }}
        >
            <div className="user-message-icon">
                {message.type === "success"
                    ? "✔"
                    : message.type === "error"
                    ? "✖"
                    : message.type === "warning"
                    ? "❗"
                    : "ℹ"}
                </div>
           <div className="user-message-content">
            <span>{message.text}</span>
            <a href="#" className="user-message-action" onClick={handleReset}>
              Reset
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
// This code defines a React component for comparing two sets of data.
// It includes two text areas for input, a button to compare the data, and a reset button.
// When the compare button is clicked, it checks if both inputs are filled.