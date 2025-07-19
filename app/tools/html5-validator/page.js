// HTML5ValidatorPage.js — Final Patch with Accurate Ad Size Detection (scrollWidth/scrollHeight Fix)
"use client";

import { FiUpload } from "react-icons/fi";
import React, { useRef, useState, useEffect } from "react";
import styles from "../display-ads/DisplayAds.module.css";
import Faq from "../../../components/Faq";
import JSZip from "jszip";
import { useAutoDismissMessage, getIcon } from "../../../components/useMessages";
import "../../../styles/globals.css";
import { sendGAEvent } from "@/utils/ga4"; // ✅ adjust if your path differs


export default function HTML5ValidatorPage() {
  const inputRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [adSize, setAdSize] = useState({ width: 0, height: 0 });
  const [message, setMessage] = useAutoDismissMessage();
  const [uploadedFileName, setUploadedFileName] = useState("");

  const title = 'How do I preview an HTML5 ad?';
  const list = [
    'Preview an HTML5 ad by uploading a zip file.',
    'Supported formats: GWD, AnimateCC, and HTML5 creatives.',
    'View live ad preview, frame images, and ad video.',
    'Analyze network timeline, load time, size, and compliance with Deep Capture enabled.'
  ];

  useEffect(() => {
    return () => {
      if (iframeUrl) {
        URL.revokeObjectURL(iframeUrl);
      }
    };
  }, [iframeUrl]);

  const handleDrop = (e) => {
  e.preventDefault();
  setIsActive(false);
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    handleFileChange({ target: { files } }, "drag");
  }
};


  const handleDragOver = (e) => {
    e.preventDefault();
    setIsActive(true);
  };

  const handleDragLeave = () => {
    setIsActive(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

      const handleFileChange = async (e, source = "browse") => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      const file = files[0];

      const labelPrefix = source === "drag" ? "Drag Upload" : "Browse Upload";

      if (!file.name.endsWith(".zip")) {
        setMessage({ type: "error", text: "Please upload a valid ZIP file." });
        console.log(`📡 GA4 Event: ${labelPrefix} - Invalid file type`);
        sendGAEvent({
          action: "file_upload_error",
          category: "HTML5 Validator",
          label: `${labelPrefix} - Non-ZIP file`,
        });
        return;
      }

  try {
    console.log(`📡 GA4 Event: ${labelPrefix} - Valid ZIP file`);
    sendGAEvent({
      action: "file_upload",
      category: "HTML5 Validator",
      label: `${labelPrefix} - ZIP with HTML`,
      value: Math.round(file.size / 1024),
    });

    setUploadedFileName(file.name);

    const zip = await JSZip.loadAsync(file);
    let indexFile = null;

    zip.forEach((relativePath, zipEntry) => {
      if (!indexFile && zipEntry.name.toLowerCase().includes("index.html")) {
        indexFile = zipEntry;
      }
    });

    if (!indexFile) {
      const htmlFiles = Object.values(zip.files).filter(f => f.name.endsWith(".html"));
      if (htmlFiles.length > 0) {
        indexFile = htmlFiles[0];
      } else {
        setMessage({ type: "error", text: "❌ No HTML file found in ZIP (e.g., index.html)" });
        console.log("📡 GA4 Event: ZIP missing HTML file");
        sendGAEvent({
          action: "file_upload_error",
          category: "HTML5 Validator",
          label: "ZIP without HTML",
        });
        return;
      }
    }

    const fileMap = new Map();
    for (const path in zip.files) {
      const entry = zip.files[path];
      if (!entry.dir) {
        const blob = await entry.async("blob");
        const blobURL = URL.createObjectURL(blob);
        fileMap.set(path, blobURL);
      }
    }

    const htmlContent = await indexFile.async("text");
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    ["img", "script", "link"].forEach(tag => {
      const attr = tag === "link" ? "href" : "src";
      doc.querySelectorAll(`${tag}[${attr}]`).forEach(el => {
        const src = el.getAttribute(attr);
        if (!src) return;
        const normalizedPath = Object.keys(zip.files).find(p => p.endsWith(src) || p.includes(src));
        if (normalizedPath && fileMap.has(normalizedPath)) {
          el.setAttribute(attr, fileMap.get(normalizedPath));
        }
      });
    });

    const sizeScript = doc.createElement("script");
    sizeScript.textContent = `
      window.addEventListener('load', function() {
        setTimeout(function() {
          const w = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
          const h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
          parent.postMessage({ type: 'ad-size', width: w, height: h }, '*');
        }, 300);
      });
    `;
    doc.body.appendChild(sizeScript);

    const blob = new Blob([doc.documentElement.outerHTML], { type: "text/html" });
    const previewUrl = URL.createObjectURL(blob);
    setIframeUrl(previewUrl);

    setMessage({ type: "success", text: `✅ ZIP uploaded: ${file.name}` });
  } catch (error) {
    console.error("File upload error:", error);
    setMessage({ type: "error", text: `Error: ${error.message}` });
    console.log("📡 GA4 Event: Exception during ZIP processing");
    sendGAEvent({
      action: "file_upload_error",
      category: "HTML5 Validator",
      label: error.message,
    });
  }
};


  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === "ad-size") {
        setAdSize({ width: e.data.width, height: e.data.height });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div className={styles.displayAdsContainer}>
      <div style={{ marginBottom: 24 }}>
        <h1 className={styles.displayAdsHeader}>HTML5 Validator</h1>
        <div className={styles.displayAdsSubtitle}>
          <b>Instant HTML5 Validation — Built for Developers..</b>
        </div>
      </div>

      <div className={styles.displayAdsInputCard}>
        <label htmlFor="displayAdInput" className={styles.displayAdsInputLabel}>
          Upload a ZIP file containing your HTML5 ad:
        </label>

        <div
          className={`${styles.dropzone} ${isActive ? styles.dropzoneActive : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          tabIndex={0}
          onClick={handleClick}
        >
          <div className={styles.dropzoneInner}>
            <FiUpload className={styles.dropzoneIcon} />
            <div className={styles.dropzoneMainText}>Drag & Drop ZIP file</div>
            <div className={styles.dropzoneBrowseText}>Or</div>
            <button className={styles.dropzoneButton} type="button">Browse & Upload</button>
            <input type="file" accept=".zip" style={{ display: "none" }} ref={inputRef} onChange={handleFileChange} />
            {uploadedFileName && (
              <div style={{ marginTop: 11, fontSize: 15, color: '#909' }}>File Name : 📁 <strong>{uploadedFileName}</strong></div>
            )}
          </div>
        </div>

        {message && (
          <div className={`user-message ${message.type}`} style={{ marginTop: 16 }}>
            <div className="user-message-icon">{getIcon(message.type)}</div>
            <div className="user-message-content">
              <span>{message.text}</span>
              <a href="#" className="user-message-action" onClick={(e) => { e.preventDefault(); setMessage(null); }}>
                Dismiss
              </a>
            </div>
          </div>
        )}

        <div className={styles.resetButtonGroup} style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <button
          className="reset-btn"
          onClick={() => {
            setIframeUrl(null);
            setAdSize({ width: 0, height: 0 });
            setUploadedFileName("");
            if (inputRef.current) inputRef.current.value = null;
            setMessage({ type: "info", text: "Reset successful — All inputs and previews have been cleared." });

            // 🟢 GA4 Reset Event
            console.log("📡 GA4 Event: Reset Clicked");
            sendGAEvent({
              action: "reset_clicked",
              category: "HTML5 Validator",
              label: "Reset Button",
            });
          }}
        >
          🔄 RESET
        </button>

        </div>

        {iframeUrl && (
          <div style={{ marginTop: 24, padding: 16, border: "2px solid #ccc", borderRadius: 8 }}>
            <h3 style={{ textAlign: "center", marginBottom: 12 }}>
              Live Preview <span style={{ fontSize: 15, fontWeight: "normal" }}>(Ad Size: {adSize.width}×{adSize.height})</span>
            </h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <iframe
                src={iframeUrl}
                title="HTML5 Preview"
                style={{
                  width: adSize.width || 970,
                  height: adSize.height || 888,
                  border: "1px solid #ccc",
                  boxShadow: "0 0 6px rgba(0,0,0,0.1)"
                }}
              />
            </div>
          </div>
        )}
      </div>

      <Faq title={title} list={list} />
    </div>
  );
}
