"use client";

import { FiUpload } from "react-icons/fi";
import React, { useRef, useState, useEffect } from "react";
// import "@styles/DisplayAds.css"; // ✅ global import (no 'styles')
import Faq from "../../../components/Faq";
import JSZip from "jszip";
import "../../../styles/Usemessages.css";
import "../../../styles/globals.css";
import "../../../styles/Html5validator.css";
import { sendGAEvent } from "@utils/ga4";

/* ----------------------------------------
   Local helpers (self-contained + reliable)
----------------------------------------- */
function useAutoDismissMessage(duration = 5000) {
  const [message, setMessage] = useState(null);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), duration);
    return () => clearTimeout(t);
  }, [message, duration]);
  return [message, setMessage];
}

function getIcon(type) {
  switch (type) {
    case "success": return "✅";
    case "error":   return "❌";
    case "warning": return "⚠️";
    case "info":    return "ℹ️";
    default:        return "";
  }
}

export default function HTML5ValidatorPage() {
  const inputRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [adSize, setAdSize] = useState({ width: 0, height: 0 });
  const [message, setMessage] = useAutoDismissMessage(7000);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const title = "How do I preview an HTML5 ad?";
  const list = [
    "Preview an HTML5 ad by uploading a zip file.",
    "Supported formats: GWD, AnimateCC, and HTML5 creatives.",
    "View live ad preview, frame images, and ad video.",
    "Analyze network timeline, load time, size, and compliance with Deep Capture enabled.",
  ];

  useEffect(() => {
    return () => {
      if (iframeUrl) URL.revokeObjectURL(iframeUrl);
    };
  }, [iframeUrl]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsActive(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileChange({ target: { files } }, "drag");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsActive(true);
  };

  const handleDragLeave = () => setIsActive(false);

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = async (e, source = "browse") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const labelPrefix = source === "drag" ? "Drag Upload" : "Browse Upload";

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setMessage({ type: "error", text: "Please upload a valid ZIP file." });
      sendGAEvent({
        action: "file_upload_error",
        category: "HTML5 Validator",
        label: `${labelPrefix} - Non-ZIP file`,
      });
      return;
    }

    try {
      setUploadedFileName(file.name);
      sendGAEvent({
        action: "file_upload",
        category: "HTML5 Validator",
        label: `${labelPrefix} - ZIP with HTML`,
        value: Math.round(file.size / 1024),
      });

      const zip = await JSZip.loadAsync(file);

      // Find index.html (or first .html fallback)
      let indexFile = null;
      zip.forEach((_, entry) => {
        if (!indexFile && entry.name.toLowerCase().includes("index.html")) {
          indexFile = entry;
        }
      });
      if (!indexFile) {
        const htmlFiles = Object.values(zip.files).filter((f) => f.name.toLowerCase().endsWith(".html"));
        if (htmlFiles.length) indexFile = htmlFiles[0];
      }
      if (!indexFile) {
        setMessage({ type: "error", text: "No HTML file found in ZIP (e.g., index.html)." });
        sendGAEvent({
          action: "file_upload_error",
          category: "HTML5 Validator",
          label: "ZIP without HTML",
        });
        return;
      }

      // Build blob URLs for all assets
      const fileMap = new Map();
      for (const path in zip.files) {
        const entry = zip.files[path];
        if (entry.dir) continue;
        const blob = await entry.async("blob");
        const blobURL = URL.createObjectURL(blob);
        fileMap.set(path, blobURL);
      }

      // Parse HTML and rewrite URLs
      const htmlContent = await indexFile.async("text");
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");

      ["img", "script", "link"].forEach((tag) => {
        const attr = tag === "link" ? "href" : "src";
        doc.querySelectorAll(`${tag}[${attr}]`).forEach((el) => {
          const src = el.getAttribute(attr);
          if (!src) return;
          const matchKey = Object.keys(zip.files).find((p) => p.endsWith(src) || p.includes(src));
          if (matchKey && fileMap.has(matchKey)) {
            el.setAttribute(attr, fileMap.get(matchKey));
          }
        });
      });

      // Inject size postMessage script
      const sizeScript = doc.createElement("script");
      sizeScript.textContent = `
        window.addEventListener('load', function () {
          setTimeout(function () {
            var w = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
            var h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            parent.postMessage({ type: 'ad-size', width: w, height: h }, '*');
          }, 300);
        });
      `;
      doc.body.appendChild(sizeScript);

      if (iframeUrl) URL.revokeObjectURL(iframeUrl);
      const blob = new Blob([doc.documentElement.outerHTML], { type: "text/html" });
      const previewUrl = URL.createObjectURL(blob);
      setIframeUrl(previewUrl);

      setMessage({ type: "success", text: `ZIP uploaded: ${file.name}` });
    } catch (err) {
      console.error("File upload error:", err);
      setMessage({ type: "error", text: `Error: ${err.message}` });
      sendGAEvent({
        action: "file_upload_error",
        category: "HTML5 Validator",
        label: err.message,
      });
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e?.data?.type === "ad-size") {
        setAdSize({ width: e.data.width, height: e.data.height });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleReset = () => {
    if (iframeUrl) URL.revokeObjectURL(iframeUrl);
    setIframeUrl(null);
    setUploadedFileName("");
    setAdSize({ width: 0, height: 0 });
    if (inputRef.current) inputRef.current.value = null;
    setMessage({ type: "info", text: "All inputs and previews have been cleared." });

    sendGAEvent({
      action: "reset_clicked",
      category: "HTML5 Validator",
      label: "Reset Button",
    });
  };

  return (
    <div className="displayAdsContainer">
      <div style={{ marginBottom: 24 }}>
        <h1 className="displayAdsHeader">HTML5 Validator</h1>
        <div className="displayAdsSubtitle">
          <b>Instant HTML5 Validation — Built for Developers.</b>
        </div>
      </div>

      <div className="displayAdsInputCard">
        <label htmlFor="displayAdInput" className="displayAdsInputLabel">
          Upload a ZIP file containing your HTML5 ad:
        </label>

        <div
  className={`dropzone ${isActive ? "dropzoneActive" : ""}`}
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onClick={handleClick}
  tabIndex={0}
>
  <div className="dropzoneInner">
    <FiUpload className="dropzoneIcon" />
    <div className="dropzoneMainText">Drag &amp; Drop ZIP file</div>
    <div className="dropzoneBrowseText">Or</div>
    <button className="dropzoneButton" type="button">Browse &amp; Upload</button>
    <input
      ref={inputRef}
      type="file"
      accept=".zip"
      style={{ display: "none" }}
      onChange={(e) => handleFileChange(e, "browse")}
    />

    {uploadedFileName && (
      <div style={{ marginTop: 11, fontSize: 15, color: "#909" }}>
        File Name : 📁 <strong>{uploadedFileName}</strong>
      </div>
    )}

    {/* ✅ RESET BUTTON only visible when file is uploaded */}
    {uploadedFileName && (
      <div className="html5AdsButtonGroup">
        <button
          className="html5AdsResetBtn"
          onClick={(e) => {
            e.stopPropagation(); // prevent dropzone click
            handleReset();
          }}
          type="button"
        >
          🔄 RESET
        </button>
      </div>
    )}
  </div>
</div>


        {message?.text && (
          <div className={`user-message ${message.type}`} style={{ marginTop: 16 }}>
            <span className="icon" style={{ marginRight: 8 }}>{getIcon(message.type)}</span>
            <span>{message.text}</span>
            <button
              className="dismiss-btn"
              style={{ marginLeft: "auto" }}
              onClick={() => setMessage(null)}
            >
              X
            </button>
          </div>
        )}

        {iframeUrl && (
          <div style={{ marginTop: 24, padding: 16, border: "2px solid #ccc", borderRadius: 8 }}>
            <h3 style={{ textAlign: "center", marginBottom: 12 }}>
              Live Preview{" "}
              <span style={{ fontSize: 15, fontWeight: "normal" }}>
                (Ad Size: {adSize.width}×{adSize.height})
              </span>
            </h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <iframe
                src={iframeUrl}
                title="HTML5 Preview"
                style={{
                  width: adSize.width || 970,
                  height: adSize.height || 888,
                  border: "1px solid #ccc",
                  boxShadow: "0 0 6px rgba(0,0,0,0.1)",
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
