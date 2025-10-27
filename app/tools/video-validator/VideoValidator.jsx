"use client";

import React, { useState, useRef, useEffect } from "react";
import { detectTagType } from "@hooks/validators/detectTagType";
import { useVASTParser } from "@hooks/validators/useVASTParser";
import { useGlobalMessage, UserMessage } from "@components/useMessages";

import "@styles/VideoValidator.css";
import TrackersTable from "@components/TrackersTable";
import EventLog from "@components/EventLog";
import FlowVisualizer from "@components/FlowVisualizer";

const TABS = {
  EVENTS: "events",
  TRACKERS: "trackers",
  FLOW: "flow",
};

export default function VideoValidator() {
  const videoRef = useRef(null);
  const [tagInput, setTagInput] = useState("");
  const [mediaFile, setMediaFile] = useState("");
  const [events, setEvents] = useState([]);
  const [trackers, setTrackers] = useState([]);
  const [activeTab, setActiveTab] = useState(TABS.EVENTS);
  const [videoDuration, setVideoDuration] = useState(0);
  const [firedEvents, setFiredEvents] = useState([]);
  const [eventLogs, setEventLogs] = useState([]);

  // ✅ Get the global addMessage function
 const addMessage = useGlobalMessage();

  const { parseVAST } = useVASTParser();

  const handleSubmit = async (inputTag) => {
    const tag = inputTag || tagInput;

    setEvents([]);
    setTrackers([]);
    setMediaFile("");
    setEventLogs([]);

    if (!tag.trim()) {
      addMessage({ title: "Submit : ", text: "   Please paste a VAST or VPAID tag  ...", type: "error" });
      return;
    }

    const tagType = await detectTagType(tag);
    if (tagType !== "vast") {
      addMessage({ title: "Submit", text: "Only VAST tags are supported", type: "warning" });
      return;
    }

    const result = await parseVAST(tag);
    if (!result || !result.mediaFile) {
      addMessage({ title: "Parser", text: "Failed to extract media file from VAST", type: "error" });
      return;
    }

    setMediaFile(result.mediaFile);
    setTrackers(result.trackers || []);
    addMessage({ title: "Tag Loaded : ", text: "VAST tag parsed successfully", type: "success" });
  };

  const handleReset = () => {
    setTagInput("");
    setEvents([]);
    setTrackers([]);
    setMediaFile("");
    setActiveTab(TABS.EVENTS);
    setEventLogs([]);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    addMessage({
      title: "Reset",
      text: " successful. All inputs and playback cleared.",
      type: "info",
    });
  };

  const quartiles = [
    { key: "start", label: "Start", fullLabel: "Video started (0% video view)", percent: 0 },
    { key: "firstQuartile", label: "25%", fullLabel: "Video First Quartile (25%) Completion", percent: 0.25 },
    { key: "midpoint", label: "50%", fullLabel: "Video Second Quartile (50%) Completion", percent: 0.5 },
    { key: "thirdQuartile", label: "75%", fullLabel: "Video Third Quartile (75%) Completion", percent: 0.75 },
    { key: "complete", label: "100%", fullLabel: "Video Fourth Quartile (100%) Completion", percent: 1.0 },
  ];

  const handleVideoProgress = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const currentTime = video.currentTime;
    const duration = video.duration;

    if (videoDuration !== duration) setVideoDuration(duration);

    quartiles.forEach(({ key, fullLabel, percent }) => {
      const fireTime = percent * duration;
      if (currentTime >= fireTime && !events.includes(key)) {
        setEvents((prev) => [...prev, key]);
        setEventLogs((prev) => [...prev, { name: fullLabel, timestamp: new Date() }]);
      }
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      if (!events.includes("start")) {
        setEvents((prev) => [...prev, "start"]);
        setEventLogs((prev) => [...prev, "start"]);
      } else if (video.currentTime < 1) {
        setEventLogs((prev) => [...prev, "rewind"]);
        setFiredEvents([]);
      } else {
        setEventLogs((prev) => [...prev, "resume"]);
      }
    };

    const handlePause = () => {
      setEventLogs((prev) => [...prev, "pause"]);
    };

    const handleVolumeChange = () => {
      if (video.muted || video.volume === 0) {
        setEventLogs((prev) => [...prev, "mute"]);
      } else {
        setEventLogs((prev) => [...prev, "unmute"]);
      }
    };

    const handleClick = () => {
      setEventLogs((prev) => [...prev, "clickThrough"]);
    };

    const handleFullscreenChange = () => {
      setEventLogs((prev) => [...prev, "fullscreen"]);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("click", handleClick);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
      video.removeEventListener("click", handleClick);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [events, videoRef]);

  return (
    <div className="vv-tool-container">
      <header className="vv-header">
        <h2 className="vv-title"> 🎥 VAST / VPAID /XML Validator</h2>
        <p className="vv-subtitle">
          Paste your VAST/VAPID URL or XML and validate playback, events & trackers.
        </p>
      </header>

      <textarea
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        placeholder="Paste VAST tag URL or XML here"
        rows={7}
        className="vv-input"
      />

      <div className="vv-button-group">
        <button className="vv-btn" onClick={handleReset}>🔄 Reset</button>
        <button className="vv-btn primary" onClick={() => handleSubmit()}>🚀 Submit</button>
      </div>

      {/* ✅ Show user messages */}
      {/* ✅ Inline messages under the buttons (scoped override) */}
      <div className="vv-inline-messages">
       <UserMessage />
     </div>

      {mediaFile && (
        <div className="vv-result-wrapper">
          <div className="vv-player-chart-row">
            <div className="vv-player-wrapper">
              <video
                ref={videoRef}
                controls
                autoPlay
                muted
                width="640"
                height="360"
                src={mediaFile}
                onPlay={() => {
                  setEventLogs((prev) => [...new Set([...prev, "Start"])]);
                }}
                onTimeUpdate={handleVideoProgress}
                onLoadedData={() =>
                  addMessage({
                    title: "",
                    text: "Media file loaded successfully",
                    type: "success",
                  })
                }
              />
            </div>
            <div className="vv-chart-wrapper"></div>
          </div>

          <div className="vv-tabs vv-tabs-bordered">
            <button
              className={`vv-tab-btn ${activeTab === TABS.EVENTS ? "active" : ""}`}
              onClick={() => setActiveTab(TABS.EVENTS)}
            >
              📋 Vast/Vpaid Ad Payload Details:
              {activeTab === TABS.EVENTS && <span className="vv-tab-arrow" />}
            </button>
            <button
              className={`vv-tab-btn ${activeTab === TABS.TRACKERS ? "active" : ""}`}
              onClick={() => setActiveTab(TABS.TRACKERS)}
            >
              🎯 Event Trackers & Pixels:
              {activeTab === TABS.TRACKERS && <span className="vv-tab-arrow" />}
            </button>
            <button
              className={`vv-tab-btn ${activeTab === TABS.FLOW ? "active" : ""}`}
              onClick={() => setActiveTab(TABS.FLOW)}
            >
              📊 FlowChart:
              {activeTab === TABS.FLOW && <span className="vv-tab-arrow" />}
            </button>
          </div>

          <div className="vv-tab-content">
            {activeTab === TABS.EVENTS && <EventLog logs={events} />}
            {activeTab === TABS.TRACKERS && <TrackersTable trackers={trackers} />}
            {activeTab === TABS.FLOW && <FlowVisualizer flowEvents={eventLogs} />}
          </div>
        </div>
      )}
    </div>
  );
}
