// DisplayAds.js — Final Patch with Structured UI
"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./DisplayAds.module.css";
import Faq from "../../../components/Faq";
import NetworkTimelineChart from "./NetworkTimelineChart";
import PerformanceSummaryBlock from "./PerformanceSummaryBlock";
import { RESOURCE_TYPE_FILTERS, getResourceType } from "./utils";
// import ad-iframe-network-data from "./computePerformanceSummary";
import computePerformanceSummary from "./computePerformanceSummary";
import { useAutoDismissMessage, getIcon } from "../../../components/useMessages";
import "../../../styles/globals.css";
import { sendGAEvent } from "@/utils/ga4";


const TRACKER_DOMAINS = {
  "doubleclick.net": "Google Ads",
  "googletagmanager.com": "Google Tag Manager",
  "facebook.net": "Meta Pixel",
  "adsrvr.org": "The Trade Desk",
  "criteo.com": "Criteo",
  "cloudflare.com": "Cloudflare CDN",
  "adnxs.com": "AppNexus",
  "moatads.com": "Moat Analytics",
  "taboola.com": "Taboola",
  "outbrain.com": "Outbrain",
  "pixel.adsafeprotected.com": "IAS",
  "doubleverify.com": "Double Verify"
};

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "invalid";
  }
}

function getServiceName(url) {
  const domain = extractDomain(url);
  for (const key in TRACKER_DOMAINS) {
    if (domain.includes(key)) return TRACKER_DOMAINS[key];
  }
  return "Unknown";
}

function isThirdParty(url) {
  const domain = extractDomain(url);
  return Object.keys(TRACKER_DOMAINS).some((d) => domain.includes(d));
}

function splitAdBlocks(input) {
  const blockRegex = /<script[\s\S]*?<\/script>|<ins[\s\S]*?<\/ins>|<div[\s\S]*?<\/div>/gi;
  let blocks = input.match(blockRegex) || [];
  input.replace(blockRegex, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => blocks.push(line));
  return blocks;
}

function validateAdBlock(b) {
  if (/^(https?:)?\/\//i.test(b.trim())) return null;
  return /<(script|ins|div)[\s\S]*?<\/(script|ins|div)>/i.test(b)
    ? null
    : "Invalid tag detected might be malformed or unsupported... Please check if you're using a <script>, <ins>, <div>, or a valid URL..";
}

function buildTimeline(resources) {
  return resources.map((r) => ({
    url: r.name,
    type: getResourceType(r),
    start: r.startTime || 0,
    end: r.responseEnd || 0,
    duration: (r.responseEnd || 0) - (r.startTime || 0),
  }));
}
// function getIcon(type) {
//         switch (type) {
//             case "success": return "✔️";
//             case "error": return "❌";
//             case "warning": return "⚠️";
//             case "info": default: return "ℹ️";
//         }
//     }
async function captureServerSide(html) {
  const res = await fetch("/api/capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html })
  });
  if (!res.ok) throw new Error("Capture failed");
  return res.json();
}

export default function DisplayAds() {
  const [adCode, setAdCode] = useState("");
  const [adBlocks, setAdBlocks] = useState([]);
  const [show, setShow] = useState(false);
  const [iframeH, setIframeH] = useState([]);
  const [error, setError] = useState("");
  const [previewLoaded, setPreviewLoaded] = useState([]);
  const [networkLoaded, setNetworkLoaded] = useState([]);
  const [netData, setNetData] = useState([]);
  const [filters, setFilters] = useState([]);
  const [deepCapture, setDeep] = useState(true);
  const [message, setMessage] = useAutoDismissMessage();
  const [tab, setTab] = useState("preview");
  const [adSizes, setAdSizes] = useState([]);
  const [iframeSrcDocs, setIframeSrcDocs] = useState([]);
  const frames = useRef([]);
  const [input, setInput] = useState("");

  const preview = () => {
  const trimmed = adCode.trim();

  if (!trimmed) {
    console.log("⛔ No input entered");
    setMessage({ type: "error", text: "Please enter a tag to preview." });
    return;
  }

  const blocks = splitAdBlocks(trimmed);
  const errorMsg = blocks.map(validateAdBlock).find((e) => e);
  if (errorMsg) {
    setMessage({ type: "error", text: errorMsg });
    return;
  }

  // ✅ GA4 event
  sendGAEvent({
    action: "tag_submitted",
    category: "interaction",
    label: "DisplayAds Tag Submit",
  });

  setAdBlocks(blocks);
  setShow(true);
  setTab("preview");
  setNetData(blocks.map(() => ({ resources: [], summary: null, timings: {}, timeline: [] })));
  setPreviewLoaded(Array(blocks.length).fill(false));
  setNetworkLoaded(Array(blocks.length).fill(!deepCapture));
  setIframeH(Array(blocks.length).fill(320));
  setAdSizes(Array(blocks.length).fill({ width: 0, height: 0 }));
  setIframeSrcDocs([]);
  setFilters(
    blocks.map(() =>
      RESOURCE_TYPE_FILTERS.reduce((acc, f) => {
        acc[f.label] = true;
        return acc;
      }, {})
    )
  );

  if (deepCapture) {
    blocks.forEach(async (b, i) => {
      const tag = /^(https?:)?\/\//i.test(b.trim())
        ? `<script src="${b.trim()}"></script>`
        : b;
      const html = `<!doctype html><html><body>${tag}</body></html>`;
      try {
        const { calls, perf } = await captureServerSide(html);
        setNetData((prev) => {
          const next = [...prev];
          next[i] = {
            resources: calls,
            timings: perf,
            summary: computePerformanceSummary(calls, perf),
            timeline: buildTimeline(calls),
          };
          return next;
        });
      } finally {
        setNetworkLoaded((prev) => {
          const updated = [...prev];
          updated[i] = true;
          return updated;
        });
      }
    });
  }

  setMessage({ type: "success", text: "Display ad previews loaded successfully." });
};

  const reset = () => {
  setAdCode("");
  setAdBlocks([]);
  setShow(false);
  setError("");
  setFilters([]);
  setTab("preview");
  setIframeH([]);
  setPreviewLoaded([]);
  setNetworkLoaded([]);
  setNetData([]);
  setAdSizes([]);
  setIframeSrcDocs([]);
  frames.current = [];
  setMessage({ type: "info", text: "Reset successful — All inputs and previews have been cleared.." });

  // ✅ GA4 Custom Event
  sendGAEvent({
    action: "reset_clicked",
    category: "interaction",
    label: "DisplayAds Reset Button"
  });
};


  useEffect(() => {
    const handler = (e) => {
      const { type, iframeIdx, width, height } = e.data || {};
      if (typeof iframeIdx !== "number") return;
      if (type === "ad-iframe-image-size") {
        setAdSizes((prev) => { const updated = [...prev]; updated[iframeIdx] = { width, height }; return updated; });
        setIframeH((prev) => { const updated = [...prev]; updated[iframeIdx] = height + 32; return updated; });
        setPreviewLoaded((prev) => { const updated = [...prev]; updated[iframeIdx] = true; return updated; });
      }
      if (type === "ad-iframe-network-data") {
        setNetData((prev) => {
          const updated = [...prev];
          updated[iframeIdx] = {
            ...updated[iframeIdx],
            resources: e.data.resources || [],
            timings: e.data.timings || {},
            summary: computePerformanceSummary(e.data.resources, e.data.timings),
            timeline: buildTimeline(e.data.resources || [])
          };
          return updated;
        });
        setNetworkLoaded((prev) => { const updated = [...prev]; updated[iframeIdx] = true; return updated; });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (!show) return;
    const docs = adBlocks.map((blk, i) => {
      const tag = /^(https?:)?\/\//i.test(blk.trim()) ? `<script src='${blk.trim()}'></script>` : blk;
      const collectScript = !deepCapture
        ? `<script>(function(){function send(){var r=performance.getEntriesByType('resource');var nav=performance.timing,t={domContentLoaded:nav.domContentLoadedEventEnd-nav.navigationStart,loadTime:nav.loadEventEnd-nav.navigationStart,firstPaint:(performance.getEntriesByType('paint').find(p=>p.name==='first-contentful-paint')||{}).startTime||0};parent.postMessage({type:'ad-iframe-network-data',iframeIdx:${i},resources:Array.from(r),timings:t},'*');}window.addEventListener('load',()=>setTimeout(send,1000));})();</script>`
        : "";
      const sizeScript = `<script>window.addEventListener('load', () => {setTimeout(() => {const all = document.body.children;let w = 0, h = 0;for (let j = 0; j < all.length; j++) {const r = all[j].getBoundingClientRect();w = Math.max(w, r.width);h = Math.max(h, r.height);}parent.postMessage({ type: 'ad-iframe-image-size', iframeIdx: ${i}, width: Math.round(w), height: Math.round(h) }, '*');}, 500);});</script>`;
      return `<!doctype html><html><body>${tag}${sizeScript}${collectScript}</body></html>`;
    });
    setIframeSrcDocs(docs);
  }, [adBlocks, show, deepCapture]);

  return (
    <div className={styles.displayAdsContainer}>
      <div style={{ border: "2px solid #ccc", borderRadius: 6, padding: 16, marginBottom: 24 }}>
        {/* header */}
            <h1 className={styles.displayAdsHeader}>Display Ad Tag Preview & Network Analyzer</h1>
            <p className={styles.displayAdsSubtitle}>
                Test and preview display ad tags in a secure sandbox with <b>Deep Capture </b> support ..
            </p>
        <textarea
          value={adCode}
          rows={9}
          className={styles.displayAdsTextarea}
          onChange={(e) => setAdCode(e.target.value)}
          placeholder=" 🔗 Paste your HTML/JavaScript display ad tag here to preview and inspect network calls..."
          style={{ width: "100%", padding: 8 }}
        />
        {message && (
        <div className={`user-message ${message.type}`} style={{ marginTop: 16 }}>
            <div className="user-message-icon">{getIcon(message.type)}</div>
            <div className="user-message-content">
            <span>{message.text}</span>
            <a
                href="#"
                className="user-message-action"
                onClick={(e) => {
                e.preventDefault();
                setMessage(null);
                }}
            >
                Dismiss
            </a>
            </div>
        </div>
        )}

        <div
                    style={{
                        display: "flex",
                        gap: 12,
                        marginTop: 8,
                        justifyContent: "flex-end", // ✅ Align to right
                        alignItems: "center",
                    }}
                >   {/* Toggle on far left */}
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={deepCapture}
                            onChange={(e) => setDeep(e.target.checked)}
                        />
                        <span className="slider"></span>
                        <span className="label-text">Deep capture</span>
                    </label>
                    {/* Reset in middle */}
                    <button
                        className={styles.displayAdsResetBtn}
                        onClick={reset}
                    >
                        🔄 Reset
                    </button>
                    {/* Submit on far right */}
                    <button
                        className={styles.displayAdsPreviewBtn}
                        onClick={preview}
                    >
                        🚀 Submit Tag
                    </button>
                </div>
      </div>

      {show && (
        <div style={{ border: "2px solid #ccc", borderRadius: 6, padding: 16 }}>
          <div className={styles.tabButtons}>
                <button onClick={() => setTab("preview")} className={tab === "preview" ? styles.activeTab : ""}>🖥️ Ad Preview</button>
                <button onClick={() => setTab("trackers")} className={tab === "trackers" ? styles.activeTab : ""}>🎯 Trackers</button>
            </div>

            {tab === "preview" && adBlocks.map((b, i) => {
                const net = netData[i] || {};
                const size = adSizes[i] || {};
                return (
                <section key={`preview-${i}`} className={styles.displayAdsPreviewArea}>
                    <p>Ad Size: {size.width || "?"}×{size.height || "?"}</p>
                    <iframe
                    key={`preview-${tab}-${i}`}
                    ref={(el) => (frames.current[i] = el)}
                    srcDoc={iframeSrcDocs[i] || ""}
                    sandbox="allow-scripts allow-same-origin"
                    style={{ width: "100%", height: iframeH[i] || 320, border: "1px solid #ccc" }}
                    title={`ad-preview-${i}`}
                    />
                    <details style={{ marginTop: 10 }}>
                    <summary>📡 Network & Performance Details</summary>
                    <div style={{ marginTop: 10 }}>
                        <NetworkTimelineChart timeline={net.timeline || []} />
                        <PerformanceSummaryBlock summary={net.summary} />
                    </div>
                    </details>
                </section>
                );
            })}

          {tab === "trackers" && adBlocks.map((b, i) => {
            const calls = netData[i]?.resources || [];
            const trackers = calls.filter((r) => isThirdParty(r.name));
            const size = adSizes[i] || {};
            if (!trackers.length) return <p key={i}>⚠️ No trackers for ad {i + 1}</p>;
            return (
              <div key={`trackers-${i}`} style={{ marginTop: 16 }}>
                <h3>🎯 {trackers.length} trackers for ad {size.width || "?"}×{size.height || "?"}</h3>
                <table className={styles.trackerTable}>
                  <thead>
                    <tr><th>#</th><th>Domain</th><th>Type</th><th>Service</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {trackers.map((r, idx) => {
                      const domain = extractDomain(r.name);
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{domain}</td>
                          <td>{getResourceType(r)}</td>
                          <td>{getServiceName(r.name)}</td>
                          <td><a href={r.name} target="_blank" rel="noopener noreferrer">🔍 View</a></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      <Faq
        title="How do I preview an HTML / Script ad tags?"
        list={[
          "Paste your display ad tag HTML or JS to preview.",
          "Get real-time load timeline, trackers, and dimensions.",
          "Enable 'Deep Capture' to collect server-side assets."
        ]}
      />
    </div>
  );
}
