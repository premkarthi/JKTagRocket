import React from "react";
import "@styles/QuartileChart.css";

const EVENT_ORDER = ["Start", "First Quartile", "Midpoint", "Third Quartile", "Complete"];

export default function QuartileChart({ eventCounts = {} }) {
  return (
    <div className="event-flow-chart">
      <h2>Quartile Progress</h2>
      {EVENT_ORDER.map((event, index) => (
        <React.Fragment key={event}>
          <div
            className={`event-node ${eventCounts[event] ? "active" : "inactive"}`}
            title={`Count: ${eventCounts[event] || 0}`}
          >
            {event}
          </div>
          {index < EVENT_ORDER.length - 1 && <div className="event-arrow">→</div>}
        </React.Fragment>
      ))}
    </div>
  );
}
