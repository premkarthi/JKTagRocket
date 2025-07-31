// File: app/components/VideoPreviewPlayer.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

export default function VideoPreviewPlayer({ vastTagUrl }) {
  const [mediaUrl, setMediaUrl] = useState("");
  const [error, setError] = useState(null);
  const playerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!vastTagUrl) return;

    async function fetchVastAndExtractMedia(vastUrl) {
      try {
        const response = await fetch(vastUrl);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const mediaFile = xmlDoc.querySelector("MediaFile");

        if (mediaFile) {
          const videoUrl = mediaFile.textContent.trim();
          setMediaUrl(videoUrl);
        } else {
          setError("No media file found in VAST tag.");
        }
      } catch (err) {
        console.error("Error loading VAST tag:", err);
        setError("Failed to load VAST tag.");
      }
    }

    fetchVastAndExtractMedia(vastTagUrl);
  }, [vastTagUrl]);

  const handleProgress = (state) => {
    setProgress(state.played * 100);
  };

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      <h2>Video Preview</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {mediaUrl ? (
        <div>
          <ReactPlayer
            ref={playerRef}
            url={mediaUrl}
            controls
            width="100%"
            height="auto"
            style={{ backgroundColor: "black" }}
            playing={false}
            onProgress={handleProgress}
          />
          <div style={{ marginTop: 10 }}>
            <strong>Progress:</strong> {progress.toFixed(2)}%
          </div>
        </div>
      ) : (
        !error && <div>Loading video from VAST...</div>
      )}
    </div>
  );
}
