import React from "react";
import "@styles/EventLog.css";

const EVENT_DESCRIPTIONS = {
  start: "Ad video Started",
  firstQuartile: "Video Viewed (25%) Completion",
  midpoint: "Video Viewed (50%) Completion",
  thirdQuartile: "Video Viewed (75%) Completion",
  complete: "Video Viewed (100%) Completion",
  mute: "Muted",
  unmute: "Unmuted",
  pause: "Paused",
  resume: "Resumed",
  rewind: "Rewound",
  fullscreen: "Fullscreen Toggled",
  acceptInvitation: "User Clicked Expand",
  close: "User Closed Ad",
  clickThrough: "User Clicked on Ad",
  impression: "Impression Tracked",
  creativeView: "Creative Viewed",
  error: "Error Occurred",
};

export default function EventLog({ logs }) {
  const enhancedLogs = logs
    .slice()
    .reverse()
    .map((log, index) => {
      const eventType = typeof log === "string" ? log : log.type;
      const time = typeof log === "string" ? new Date() : new Date(log.timestamp);
      return {
        sno: logs.length - index,
        event: eventType,
        description: EVENT_DESCRIPTIONS[eventType] || "Unknown Event",
        timestamp: time.toLocaleString(),
      };
    });

  return (
    <div className="event-log-table-container">
      <h2>Event Log</h2>
      <table className="event-log-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Event</th>
            <th>Description</th>
            <th>Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {enhancedLogs.map((log) => (
            <tr key={log.sno}>
              <td>{log.sno}</td>
              <td>{log.event}</td>
              <td>{log.description}</td>
              <td>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
