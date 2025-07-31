import React from "react";
import "@styles//EventLog.css";

export default function EventLog({ logs }) {
  return (
    <div className="event-log">
      <h4>Event Log</h4>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>{log}</li>
        ))}
      </ul>
    </div>
  );
}
