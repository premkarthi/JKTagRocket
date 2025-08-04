"use client";

import React, { useState, useRef } from "react";
import { detectTagType } from "@hooks/validators/detectTagType";
import { useVASTParser } from "@hooks/validators/useVASTParser";
import { UserMessage, addMessage } from "@components/useGlobalMessage";

import "@styles/VideoValidator.css";
import TrackersTable from "@components/TrackersTable";
import EventLog from "@components/EventLog";
import QuartileChart from "@components/QuartileChart";

const TABS = {
  EVENTS: "events",
  TRACKERS: "trackers",
};

export default function VideoValidator() {
  const videoRef = useRef(null);
  const [tagInput, setTagInput] = useState("");
  const [mediaFile, setMediaFile] = useState("");
  const [events, setEvents] = useState([]);
  const [trackers, setTrackers] = useState([]);
  const [activeTab, setActiveTab] = useState(TABS.EVENTS);
  const [videoDuration, setVideoDuration] = useState(0);

  const { parseVAST } = useVASTParser();

  const handleSubmit = async () => {
    setEvents([]);
    setTrackers([]);
    setMediaFile("");

    if (!tagInput.trim()) {
      addMessage({ title: "Submit", text: "Please paste a VAST or VPAID tag", type: "error" });
      return;
    }

    const tagType = await detectTagType(tagInput);
    if (tagType !== "vast") {
      addMessage({ title: "Submit", text: "Only VAST tags are supported", type: "warning" });
      return;
    }

    const result = await parseVAST(tagInput);
    if (!result || !result.mediaFile) {
      addMessage({ title: "Parser", text: "Failed to extract media file from VAST", type: "error" });
      return;
    }

    setMediaFile(result.mediaFile);
    setTrackers(result.trackers || []);
    addMessage({ title: "Tag Loaded", text: "VAST tag parsed successfully", type: "success" });
  };

  const handleReset = () => {
    setTagInput("");
    setEvents([]);
    setTrackers([]);
    setMediaFile("");
    setActiveTab(TABS.EVENTS);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    addMessage({
      title: "Reset",
      text: "Reset successful. All inputs and playback cleared.",
      type: "info",
    });
  };

  const handleVideoProgress = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const currentTime = video.currentTime;
    const duration = video.duration;

    if (videoDuration !== duration) setVideoDuration(duration);

    const quartiles = [
      { label: "Start", percent: 0 },
      { label: "First Quartile", percent: 0.25 },
      { label: "Midpoint", percent: 0.5 },
      { label: "Third Quartile", percent: 0.75 },
      { label: "Complete", percent: 1 },
    ];

    quartiles.forEach(({ label, percent }) => {
      const fireTime = percent * duration;
      if (currentTime >= fireTime && !events.includes(label)) {
        setEvents((prev) => [...prev, label]);
      }
    });
  };

  const eventCounts = events.reduce((acc, event) => {
    acc[event] = (acc[event] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="vv-tool-container">
      <h2 className="vv-title">🎥 Video Validator</h2>

      <textarea
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        placeholder="Paste VAST tag URL or XML here"
        rows={7}
        className="vv-input"
      />

      <div className="vv-button-group">
        <button className="vv-btn" onClick={handleReset}>🔄 Reset</button>
        <button className="vv-btn primary" onClick={handleSubmit}>🚀 Submit</button>
      </div>

      <UserMessage />

      {mediaFile && (
        <div className="vv-result-wrapper">
          <div className="vv-tabs vv-tabs-bordered">
            <button
              className={`vv-tab-btn ${activeTab === "events" ? "active" : ""}`}
              onClick={() => setActiveTab("events")}
            >
              📋 Vast/Vpaid Ad Payload Details
              {activeTab === "events" && <span className="vv-tab-arrow" />}
            </button>
            <button
              className={`vv-tab-btn ${activeTab === "trackers" ? "active" : ""}`}
              onClick={() => setActiveTab("trackers")}
            >
              🎯 Event Trackers & Pixels
              {activeTab === "trackers" && <span className="vv-tab-arrow" />}
            </button>
          </div>

          {activeTab === "events" && (
            <>
              <div className="vv-player-chart-row">
                <div className="vv-player-wrapper">
                  <video
                  ref={videoRef}
                  controls
                  autoPlay
                  muted
                  width="640"
                  height="360"
                  src={mediaFile} // ✅ now receives correct string URL
                  onTimeUpdate={handleVideoProgress}
                  onLoadedData={() =>
                    addMessage({
                      title: "Video Loaded",
                      text: "Media file loaded successfully",
                      type: "success",
                    })
                  }
                />

                </div>
                <div className="vv-chart-wrapper">
                  <QuartileChart eventCounts={eventCounts} />
                </div>
              </div>

              <div className="vv-results">
                <EventLog logs={events} />
              </div>
            </>
          )}

          {activeTab === "trackers" && (
            <div className="vv-results">
              <TrackersTable trackers={trackers} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
