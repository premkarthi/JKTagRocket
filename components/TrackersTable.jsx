"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import { TRACKER_DOMAINS } from "@utils/trackerDomains";
import Customtooltip from "@components/Customtooltip";
import TrackerModal from "@components/TrackerModal";
import TrackerActions from "@components/TrackerActions"; // ✅ New shared actions
import styles from "@styles/Trackerstable.module.css";

function getAdServerName(url = "") {
  try {
    const hostname = new URL(url).hostname;
    const domainMatch = Object.keys(TRACKER_DOMAINS).find((domain) =>
      hostname.includes(domain)
    );
    return domainMatch ? TRACKER_DOMAINS[domainMatch] : "Unknown";
  } catch {
    return "Unknown";
  }
}

export default function TrackersTable({ trackers }) {
  const [selectedTracker, setSelectedTracker] = useState(null);

  if (!Array.isArray(trackers) || trackers.length === 0) {
    return <p className={styles.emptyMessage}>No trackers found.</p>;
  }

  const handleExpandClick = (tracker) => {
    const adServer = getAdServerName(tracker.url);
    setSelectedTracker({ ...tracker, adServer });
  };

  return (
    <>
      <div className={styles.tableWrapper}>
        <table className={styles.trackersTable}>
          <thead>
            <tr>
              <th>Event</th>
              <th>URL</th>
              <th>Ad Server</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trackers.map((tracker, index) => (
              <tr key={index}>
                <td>{tracker.event || "—"}</td>
                <td className={styles.truncateCell}>
                  <div className={styles.urlWithExpand}>
                    <a
                      href={tracker.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.trackerLink}
                    >
                      {tracker.url}
                    </a>
                    <Customtooltip text="Expand URL" variant="animated">
                      <button onClick={() => handleExpandClick(tracker)}>🔍</button>
                    </Customtooltip>
                  </div>
                </td>
                <td>{getAdServerName(tracker.url)}</td>
                <td className={styles.actionButtons}>
                  {/* ✅ Using shared actions here */}
                  <TrackerActions url={tracker.url} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTracker && (
        <TrackerModal
          tracker={selectedTracker}
          onClose={() => setSelectedTracker(null)}
        />
      )}
    </>
  );
}

TrackersTable.propTypes = {
  trackers: PropTypes.arrayOf(
    PropTypes.shape({
      event: PropTypes.string,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
};
