"use client";

import React, { useState, useRef } from "react";
import styles from "@styles/VideoValidator.module.css";
import TrackersTable from "@components/TrackersTable";
import QuartileChart from "@components/QuartileChart";
import EventLog from "@components/EventLog";
import { UserMessage, useAutoDismissMessage } from "@components/UserMessages";

const TABS = {
  EVENTS: "📋 Vast/Vpaid Ad Payload Details",
  TRACKERS: "🎯 Event Trackers & Pixels",
};

export default function VideoValidator() {
  const [tagInput, setTagInput] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [previewSize, setPreviewSize] = useState("medium");
  const [objectFit, setObjectFit] = useState("contain");
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

  const videoRef = useRef();

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

  const extractTrackingUrls = (xmlText) => {
    try {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "text/xml");
      const nodes = xml.querySelectorAll("Tracking");
      return Array.from(nodes)
        .map((node) => ({
          event: node.getAttribute("event"),
          url: node.textContent.trim(),
        }))
        .filter((t) => t.url && t.url.startsWith("http"));
    } catch {
      return [];
    }
  };

  const handlePreview = async () => {
    setVideoUrl(null);
    setProgress(0);
    setQuartiles({ Q1: false, Mid: false, Q3: false, Complete: false });
    setEventLogs([]);
    setTrackers([]);

    if (!tagInput.trim()) {
      setMessage({ type: "error", text: "Please enter a VAST URL or raw VAST XML." });
      return;
    }

    let vastXml = tagInput.trim();

    if (!vastXml.startsWith("<VAST")) {
      try {
        const res = await fetch(vastXml);
        if (!res.ok) throw new Error("Failed to fetch VAST tag.");
        vastXml = await res.text();
      } catch (err) {
        setMessage({ type: "error", text: "Fetch error: " + err.message });
        return;
      }
    }

    const mediaFileUrl = extractMediaFileUrl(vastXml);
    const extractedTrackers = extractTrackingUrls(vastXml).map((url) => ({
    event: "—", // or extract from VAST properly
    url,
    }));
    setTrackers(extractedTrackers);


    if (!mediaFileUrl) {
      setMessage({ type: "error", text: "No <MediaFile> found in VAST." });
      return;
    }

    setVideoUrl(mediaFileUrl);
    setTrackers(extractedTrackers);
    setMessage({ type: "success", text: "VAST loaded successfully." });
  };

  const handleReset = () => {
    setTagInput("");
    setVideoUrl(null);
    setProgress(0);
    setQuartiles({ Q1: false, Mid: false, Q3: false, Complete: false });
    setEventLogs([]);
    setTrackers([]);
    setMessage({ type: "info", text: "Input cleared and preview reset." });
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);

    const q = { ...quartiles };
    if (!q.Q1 && percent >= 25) {
      q.Q1 = true;
      logEvent("25% Reached");
    }
    if (!q.Mid && percent >= 50) {
      q.Mid = true;
      logEvent("50% Reached");
    }
    if (!q.Q3 && percent >= 75) {
      q.Q3 = true;
      logEvent("75% Reached");
    }
    if (!q.Complete && percent >= 99) {
      q.Complete = true;
      logEvent("100% Complete");
    }
    setQuartiles(q);
  };

  const logEvent = (msg) => {
    setEventLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const { width, height } = {
    medium: { width: 640, height: 360 },
    large: { width: 768, height: 432 },
    small: { width: 400, height: 240 },
  }[previewSize] || { width: 640, height: 360 };

  return (
    <div className={styles.validatorContainer}>
      <h1 className={styles.header}>🎥 VAST / VPAID Ad Validator</h1>
      <p className={styles.subHeader}>
        Paste your VAST/VPAID XML or URL below to preview the video and validate tracking pixels.
      </p>

      <UserMessage message={message} setMessage={setMessage} />

      <div className={styles.inputCard}>
        <textarea
          className={styles.inputTextarea}
          placeholder="🔗 Paste VAST XML or Tag URL here..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />

        <div className={styles.buttonGroup}>
          <button className={styles.resetBtn} onClick={handleReset}>🔄 Reset</button>
          <button className={styles.submitBtn} onClick={handlePreview}>🚀 Validate Tag</button>
        </div>
      </div>

      {videoUrl && (
        <>
          <div className={styles.videoWrapper} style={{ width, height }}>
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              autoPlay
              onTimeUpdate={handleTimeUpdate}
              style={{ width: "100%", height: "100%", objectFit }}
            />
          </div>

          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {Object.values(TABS).map((tab) => (
              <button
                key={tab}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.active : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === TABS.EVENTS && (
              <>
                <QuartileChart progress={quartiles} />
                <EventLog logs={eventLogs} />
              </>
            )}
            {activeTab === TABS.TRACKERS && <TrackersTable trackers={trackers} />}
          </div>
        </>
      )}
    </div>
  );
}
