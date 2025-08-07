import React from "react";
import "@styles/FlowVisualizer.css";

const chartSteps = [
  { key: "start", label: "Start" },
  { key: "firstQuartile", label: "25%" },
  { key: "midpoint", label: "50%" },
  { key: "thirdQuartile", label: "75%" },
  { key: "complete", label: "100%" },
];

export default function FlowVisualizer({ flowEvents }) {
  const keysFromLabels = (flowEvents || []).map((entry) => {
    const label =
      typeof entry === "string"
        ? entry
        : typeof entry === "object" && entry !== null
        ? entry.event
        : "";

    const lower = (label || "").toLowerCase();

    if (lower.includes("0%")) return "start";
    if (lower.includes("25%") || lower.includes("firstquartile")) return "firstQuartile";
    if (lower.includes("50%") || lower.includes("midpoint")) return "midpoint";
    if (lower.includes("75%") || lower.includes("thirdquartile")) return "thirdQuartile";
    if (lower.includes("100%") || lower.includes("complete")) return "complete";
    return "";
  });

  return (
    <div className="flow-chart">
      {chartSteps.map(({ key, label }) => (
        <div
          key={key}
          className={`step-box ${keysFromLabels.includes(key) ? "active" : ""}`}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
