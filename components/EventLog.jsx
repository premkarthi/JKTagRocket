import React from "react";
import "@styles/EventLog.css";

export default function EventLog({ logs }) {
  return (
    <div className="event-log">
      <h2>Event Log</h2>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>{log}</li>
        ))}
      </ul>
    </div>
  );
}
