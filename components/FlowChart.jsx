"use client";

import React from "react";
import "@styles/FlowChart.css";

// FlowChart accepts a flowEvents prop which is an array of event names
export default function FlowChart({ flowEvents }) {
  const systemEvents = [
    "Ad Requested",
    "Ad Response",
    "Ad Impression",
    "Ad Started",
    "Ad Completed",
  ];

  const playbackEvents = [
    "Start",
    "First Quartile",
    "Midpoint",
    "Third Quartile",
    "Complete",
  ];

  const userEvents = [
    "Click",
    "Mute",
    "Unmute",
    "Pause",
    "Resume",
    "Error",
  ];

  const getStatusClass = (event) => {
    if (flowEvents.includes(event)) {
      if (event === "Error") return "error";
      if (userEvents.includes(event)) return "user";
      return "done";
    }
    return "pending";
  };

  return (
    <div className="flowchart-container">
      <div className="flowchart-header">Ad Requested to Server</div>
      <div className="flowchart-grid">
        <div className="flowchart-column">
          <h4>System Events</h4>
          {systemEvents.map((event) => (
            <div
              key={event}
              className={`flowchart-box ${getStatusClass(event)}`}
            >
              {event}
            </div>
          ))}
        </div>

        <div className="flowchart-column">
          <h4>Playback Events</h4>
          {playbackEvents.map((event) => (
            <div
              key={event}
              className={`flowchart-box ${getStatusClass(event)}`}
            >
              {event}
            </div>
          ))}
        </div>

        <div className="flowchart-column">
          <h4>User Actions & Errors</h4>
          {userEvents.map((event) => (
            <div
              key={event}
              className={`flowchart-box ${getStatusClass(event)}`}
            >
              {event}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
