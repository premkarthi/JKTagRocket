import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Customtooltip from "@components/Customtooltip";
import TooltipCopyButton from "@components/TooltipcopyButton";
import TooltipOpenNewTabButton from "@components/TooltipOpenNewTabButton";
import "@styles/TrackerModal.css"; // <-- global CSS import

export default function TrackerModal({ tracker, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="modalBackdrop">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>×</button>
        <h2 className="modalTitle">Tracker Details</h2>

        <div className="detailRow">
          <span className="label">Event:</span>
          <span className="value">{tracker.event || "—"}</span>
        </div>

        <div className="detailRow">
          <span className="label">Ad Server:</span>
          <span className="value">{tracker.adServer || "Unknown"}</span>
        </div>

        <div className="detailRow">
          <span className="label">URL:</span>
          <textarea
            className="urlBox"
            value={tracker.url}
            readOnly
            rows={5}
          />
        </div>

        <div className="buttonRow">
          <Customtooltip text="Copy to Clipboard" variant="copy">
            <TooltipCopyButton value={tracker.url} />
          </Customtooltip>

          <Customtooltip text="Open in New Tab" variant="animated">
            <TooltipOpenNewTabButton url={tracker.url} />
          </Customtooltip>
        </div>
      </div>
    </div>
  );
}
