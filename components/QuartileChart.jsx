import React from "react";
import "@styles/QuartileChart.css";

export default function QuartileChart({ progress }) {
  return (
    <div className="quartile-chart">
      <div className={progress.Q1 ? "active" : ""}>25%</div>
      <div className={progress.Mid ? "active" : ""}>50%</div>
      <div className={progress.Q3 ? "active" : ""}>75%</div>
      <div className={progress.Complete ? "active" : ""}>100%</div>
    </div>
  );
}
