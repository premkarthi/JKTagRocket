"use client";

import React, { useState, useRef } from "react";
import "@styles/VideoValidator.css";
import TrackersTable from "@components/TrackersTable";
import QuartileChart from "@components/QuartileChart";
import EventLog from "@components/EventLog";
import { useAutoDismissMessage, UserMessage } from "components/useMessages";
import "../../../styles/Usemessages.css";

const TABS = {
  EVENTS: "📋 Vast/Vpaid Ad Payload Details",
  TRACKERS: "🎯 Event Trackers & Pixels",
};

export default function VideoValidator() {
  const [tagInput, setTagInput] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [quartiles, setQuartiles] = useState({
    Q1: false,
    Mid: false,
    Q3: false,
    Complete: false,
  });
  const [eventLogs, setEventLogs] = useState([]);
  const [trackers, setTrackers] = useState([]);
  const [activeTab, setActiveTab] = useState(TABS.EVENTS);
  const [message, setMessage] = useAutoDismissMessage();
  const [loading, setLoading] = useState(false);

  const videoRef = useRef();
  const firedRef = useRef({ Q1: false, Mid: false, Q3: false, Complete: false });

  const extractMediaFileUrl = (xmlText) => {
    try {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "text/xml");
      const mediaFile = xml.querySelector("MediaFile");
      return mediaFile?.textContent?.trim() || null;
    } catch {
      return null;
    }
  };

  const extractTrackingNodes = (xmlText) => {
    try {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "text/xml");
      const nodes = Array.from(xml.querySelectorAll("Tracking"));
      return nodes
        .map((node) => ({
          event: node.getAttribute("event") || "-",
          url: (node.textContent || "").trim(),
        }))
        .filter((t) => t.url && /^https?:\/\//i.test(t.url));
    } catch {
      return [];
    }
  };

  const handlePreview = async () => {
    setLoading(true);
    setVideoUrl(null);
    setProgress(0);
    setQuartiles({ Q1: false, Mid: false, Q3: false, Complete: false });
    setEventLogs([]);
    setTrackers([]);
    firedRef.current = { Q1: false, Mid: false, Q3: false, Complete: false };
    setMessage(null);

    if (!tagInput.trim()) {
      setLoading(false);
      setMessage({ type: "warning", text: "Please paste a VAST URL or raw VAST XML." });
      return;
    }

    let vastXml = tagInput.trim();

    try {
      if (!vastXml.startsWith("<VAST")) {
        const res = await fetch(vastXml);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        vastXml = await res.text();
      }

      const mediaFileUrl = extractMediaFileUrl(vastXml);
      const extractedTrackers = extractTrackingNodes(vastXml);

      if (!mediaFileUrl) {
        setMessage({ type: "error", text: "No <MediaFile> found in VAST." });
        setLoading(false);
        return;
      }

      setTrackers(extractedTrackers);
      setVideoUrl(mediaFileUrl);
      setMessage({ type: "success", text: "VAST loaded successfully." });
    } catch (err) {
      setMessage({ type: "error", text: `Failed to load VAST: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTagInput("");
    setVideoUrl(null);
    setProgress(0);
    setQuartiles({ Q1: false, Mid: false, Q3: false, Complete: false });
    setEventLogs([]);
    setTrackers([]);
    firedRef.current = { Q1: false, Mid: false, Q3: false, Complete: false };
    setMessage({ type: "info", text: "Cleared input and reset preview." });
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);

    if (!firedRef.current.Q1 && percent >= 25) {
      firedRef.current.Q1 = true;
      setQuartiles((prev) => ({ ...prev, Q1: true }));
      logEvent("25% Reached");
    }
    if (!firedRef.current.Mid && percent >= 50) {
      firedRef.current.Mid = true;
      setQuartiles((prev) => ({ ...prev, Mid: true }));
      logEvent("50% Reached");
    }
    if (!firedRef.current.Q3 && percent >= 75) {
      firedRef.current.Q3 = true;
      setQuartiles((prev) => ({ ...prev, Q3: true }));
      logEvent("75% Reached");
    }
    if (!firedRef.current.Complete && percent >= 99) {
      firedRef.current.Complete = true;
      setQuartiles((prev) => ({ ...prev, Complete: true }));
      logEvent("100% Complete");
    }
  };

  const logEvent = (msg) => {
    setEventLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  return (
    <div className="video-validator-container">
      <header className="vv-header">
        <h2 className="vv-title">VAST / VPAID Validator</h2>
        <p className="vv-subtitle">Paste your VAST URL or XML and validate playback, events & trackers.</p>
      </header>

      <section className="vv-input-card">
        <label htmlFor="vast-input" className="vv-input-label">
          VAST URL or XML
        </label>
        <div className="vv-input-row">
          <textarea
            id="vast-input"
            className="vv-textarea"
            rows={7}
            placeholder="https://adserver.com/path/to/vast.xml  OR  <VAST version='3.0'>...</VAST>"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
        </div>

        <div className="vv-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleReset}
            disabled={loading && !videoUrl}
            title="Clear the input and reset preview"
          >
            🔄 Reset
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePreview}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden /> Validating…
              </>
            ) : (
              <>🚀 Validate VAST</>
            )}
          </button>
        </div>
      </section>

      {message && (
        <div className="vv-message-block" style={{ margin: "16px 0", padding: "10px", minHeight: "40px" }}>
          <UserMessage message={message} setMessage={setMessage} />
        </div>
      )}

      {videoUrl && (
        <>
          <section className="vv-player-block">
            <div className="video-wrapper">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div className="progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </section>

          <nav className="tab-header" aria-label="Sections">
            {Object.values(TABS).map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </nav>

          <section className="tab-content">
            {activeTab === TABS.EVENTS && (
              <>
                <QuartileChart progress={quartiles} />
                <EventLog logs={eventLogs} />
              </>
            )}
            {activeTab === TABS.TRACKERS && <TrackersTable trackers={trackers} />}
          </section>
        </>
      )}
    </div>
  );
}
