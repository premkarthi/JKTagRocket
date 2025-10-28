"use client";

import React, { useState, useEffect, useRef } from "react";
import "@styles/DisplayAds.css";
import NetworkTimelineChart from "@components/NetworkTimelineChart";
import PerformanceSummaryBlock from "@components/PerformanceSummaryBlock";
import { RESOURCE_TYPE_FILTERS, getResourceType } from "@components/utils";
import computePerformanceSummary from "@components/computePerformanceSummary";
import TrackerActions from "@components/TrackerActions";
import Customtooltip from "@components/Customtooltip";
import { getIcon } from "@components/useMessages";
import { sendGAEvent } from "@utils/ga4";
import JSZip from "jszip";

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
  "doubleverify.com": "Double Verify",
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
  for (const key in TRACKER_DOMAINS) if (domain.includes(key)) return TRACKER_DOMAINS[key];
  return "Unknown";
}
function isThirdParty(url) {
  const domain = extractDomain(url);
  return Object.keys(TRACKER_DOMAINS).some((d) => domain.includes(d));
}
function splitAdBlocks(input) {
  const blockRegex = /<script[\s\S]*?<\/script>|<ins[\s\S]*?<\/ins>|<div[\s\S]*?<\/div>/gi;
  let blocks = input.match(blockRegex) || [];
  input
    .replace(blockRegex, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((l) => blocks.push(l));
  return blocks;
}
function validateAdBlock(b) {
  if (/^(https?:)?\/\//i.test(b.trim())) return null;
  return /<(script|ins|div)[\s\S]*?<\/(script|ins|div)>/i.test(b)
    ? null
    : "Invalid tag detected. Please use a <script>, <ins>, <div>, or valid URL.";
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
async function captureServerSide(html) {
  const res = await fetch("/api/capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html }),
  });
  if (!res.ok) throw new Error("Capture failed");
  return res.json();
}

export default function DisplayAds() {
  const [adCode, setAdCode] = useState("");
  const [adBlocks, setAdBlocks] = useState([]);
  const [show, setShow] = useState(false);
  const [iframeH, setIframeH] = useState([]);
  const [previewLoaded, setPreviewLoaded] = useState([]);
  const [networkLoaded, setNetworkLoaded] = useState([]);
  const [netData, setNetData] = useState([]);
  const [filters, setFilters] = useState([]);
  const [deepCapture, setDeep] = useState(true);
  const [message, setMessage] = useState(null);
  const [tab, setTab] = useState("preview");
  const [adSizes, setAdSizes] = useState([]);
  const [iframeSrcDocs, setIframeSrcDocs] = useState([]);
  const frames = useRef([]);
  const [preparing, setPreparing] = useState(false);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 7000);
    return () => clearTimeout(t);
  }, [message]);

  const preview = async () => {
    const trimmed = adCode.trim();
    if (!trimmed) {
      setMessage({ type: "error", text: "Please enter a tag to preview." });
      return;
    }

    const blocks = splitAdBlocks(trimmed);
    const errorMsg = blocks.map(validateAdBlock).find((e) => e);
    if (errorMsg) {
      setMessage({ type: "error", text: errorMsg });
      return;
    }

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

    setPreparing(true);
    const docs = blocks.map((blk, i) => {
      const tag = /^(https?:)?\/\//i.test(blk.trim())
        ? `<script src='${blk.trim()}'></script>`
        : blk;
      const sizeScript = `<script>
        window.addEventListener('load', function() {
          setTimeout(function() {
            const all = document.body.children;
            let w = 0, h = 0;
            for (let j = 0; j < all.length; j++) {
              const r = all[j].getBoundingClientRect();
              w = Math.max(w, Math.round(r.width));
              h = Math.max(h, Math.round(r.height));
            }
            parent.postMessage({ type: 'ad-iframe-image-size', iframeIdx: ${i}, width: w, height: h }, '*');
          }, 350);
        });
      </script>`;
      return `<!doctype html><html><head><meta charset="utf-8"></head><body>${tag}${sizeScript}</body></html>`;
    });

    setIframeSrcDocs(docs);
    setTimeout(() => setPreparing(false), 250);

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
        } catch (e) {
          console.error("captureServerSide error:", e);
        } finally {
          setNetworkLoaded((prev) => {
            const updated = [...prev];
            updated[i] = true;
            return updated;
          });
        }
      });
    }

    setMessage({ type: "success", text: "Display ad previews prepared." });
  };

  const reset = () => {
    setAdCode("");
    setAdBlocks([]);
    setShow(false);
    setFilters([]);
    setTab("preview");
    setIframeH([]);
    setPreviewLoaded([]);
    setNetworkLoaded([]);
    setNetData([]);
    setAdSizes([]);
    setIframeSrcDocs([]);
    frames.current = [];
    setMessage({
      type: "info",
      text: "Reset successful — All inputs and previews cleared.",
    });
    sendGAEvent({
      action: "reset_clicked",
      category: "interaction",
      label: "DisplayAds Reset Button",
    });
  };

  useEffect(() => {
    const handler = (e) => {
      const { type, iframeIdx, width, height } = e.data || {};
      if (typeof iframeIdx !== "number") return;
      if (type === "ad-iframe-image-size") {
        setAdSizes((prev) => {
          const updated = [...prev];
          updated[iframeIdx] = { width, height };
          return updated;
        });
        setIframeH((prev) => {
          const updated = [...prev];
          updated[iframeIdx] = height ? height + 32 : prev[iframeIdx];
          return updated;
        });
        setPreviewLoaded((prev) => {
          const updated = [...prev];
          updated[iframeIdx] = true;
          return updated;
        });
      }
      if (type === "ad-iframe-network-data") {
        setNetData((prev) => {
          const updated = [...prev];
          updated[iframeIdx] = {
            ...updated[iframeIdx],
            resources: e.data.resources || [],
            timings: e.data.timings || {},
            summary: computePerformanceSummary(e.data.resources, e.data.timings),
            timeline: buildTimeline(e.data.resources || []),
          };
          return updated;
        });
        setNetworkLoaded((prev) => {
          const updated = [...prev];
          updated[iframeIdx] = true;
          return updated;
        });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div className="displayAdsContainer">
      <div className="displayAdsInputCard">
        <h1 className="displayAdsHeader">Display Ad Tag Preview & Network Analyzer</h1>
        <div className="displayAdsSubtitle">
          Test and preview display ad tags in a secure sandbox with <b>Deep Capture</b> support.
        </div>

        {/* ✅ Fixed Textarea Section */}
        <div className="displayAdsTextareaWrapper">
          <textarea
            className="displayAdsTextarea"
            placeholder="🔗 Paste your HTML / JavaScript display ad tag here to preview and inspect network calls..."
            value={adCode}
            onChange={(e) => setAdCode(e.target.value)}
          />

          <div className="copyButtonWrapper">
            <Customtooltip text="Copy to Clipboard" variant="copy">
              <button
                className="displayAdsCopyButton"
                onClick={() => {
                  if (adCode.trim()) {
                    navigator.clipboard.writeText(adCode);
                    setMessage({
                      type: "success",
                      text: "Ad tag copied to clipboard!",
                    });
                  } else {
                    setMessage({
                      type: "error",
                      text: "Nothing to copy.",
                    });
                  }
                }}
              >
                📋
              </button>
            </Customtooltip>
          </div>
        </div>

        <div className="displayAdsButtonGroup">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={deepCapture}
              onChange={(e) => setDeep(e.target.checked)}
            />
            <span className="slider"></span>
            <span className="label-text">Deep capture</span>
          </label>

          <button className="displayAdsResetBtn" onClick={reset}>
            🔄 Reset
          </button>
          <button className="displayAdsPreviewBtn" onClick={preview}>
            🚀 Submit Tag
          </button>
        </div>

        {preparing && <p className="preparingText">⏳ Preparing preview...</p>}

        {message && (
          <div
            className={`user-message inline ${message.type}`}
            style={{ marginTop: 12 }}
          >
            <div className="user-message-icon">{getIcon(message.type)}</div>
            <div className="user-message-content">
              <span>{message.text}</span>
            </div>
            <a
              href="#"
              className="user-message-action"
              onClick={(e) => {
                e.preventDefault();
                setMessage(null);
              }}
            >
              X Dismiss
            </a>
          </div>
        )}
      </div>

      {/* === PREVIEW SECTION === */}
      {show && (
        <div className="displayAdsPreviewArea">
          <div className="tabButtons">
            <button
              onClick={() => setTab("preview")}
              className={tab === "preview" ? "activeTab" : ""}
            >
              🖥️ Ad Preview
            </button>
            <button
              onClick={() => setTab("trackers")}
              className={tab === "trackers" ? "activeTab" : ""}
            >
              🎯 Trackers
            </button>
          </div>

          {/* PREVIEW TAB */}
          {tab === "preview" &&
            adBlocks.map((b, i) => {
              const net = netData[i] || {};
              const size = adSizes[i] || {};
              const networkIsLoading = !networkLoaded[i];
              return (
                <section key={`preview-${i}`} className="adPreviewWrapper">
                  <p>
                    <strong>Ad Size:</strong>{" "}
                    <span className="adSizeSpan">
                      {size.width || "?"}×{size.height || "?"}
                    </span>
                  </p>
                  <iframe
                    ref={(el) => (frames.current[i] = el)}
                    srcDoc={iframeSrcDocs[i] || ""}
                    sandbox="allow-scripts allow-same-origin"
                    style={{
                      width: "100%",
                      height: iframeH[i] || 320,
                      border: "1px solid #ccc",
                    }}
                    title={`ad-preview-${i}`}
                  />
                  <hr className="adDivider" />
                  <details style={{ marginTop: 10 }}>
                    <summary>
                      📡 Network & Performance Details —{" "}
                      <span className="netSizeText">
                        {size.width || "?"}×{size.height || "?"}
                      </span>
                    </summary>
                    <div style={{ marginTop: 10 }}>
                      {networkIsLoading ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <span className="displayAdsLoader">⟳</span>
                          <span style={{ color: "#6b7280" }}>
                            Loading network calls...
                          </span>
                        </div>
                      ) : (
                        <>
                          <NetworkTimelineChart timeline={net.timeline || []} />
                          <PerformanceSummaryBlock summary={net.summary} />
                        </>
                      )}
                    </div>
                  </details>
                </section>
              );
            })}

          {/* TRACKERS TAB */}
          {tab === "trackers" &&
            adBlocks.map((b, i) => {
              const calls = netData[i]?.resources || [];
              const trackers = calls.filter((r) => isThirdParty(r.name));
              const size = adSizes[i] || {};
              const networkIsLoading = !networkLoaded[i];
              return (
                <div key={`trackers-${i}`} className="trackerSection">
                  <h3>
                    🎯 Trackers —{" "}
                    <span className="adSizeSpan">
                      {size.width || "?"}×{size.height || "?"}
                    </span>
                  </h3>
                  {networkIsLoading ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 10,
                      }}
                    >
                      <span className="displayAdsLoader">⟳</span>
                      <span style={{ color: "#6b7280" }}>
                        Loading network calls...
                      </span>
                    </div>
                  ) : trackers.length === 0 ? (
                    <p>⚠️ No trackers for ad {i + 1}</p>
                  ) : (
                    <table className="trackerTable">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Domain</th>
                          <th>Type</th>
                          <th>Service</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trackers.map((r, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{extractDomain(r.name)}</td>
                            <td>{getResourceType(r)}</td>
                            <td>{getServiceName(r.name)}</td>
                            <td>
                              <TrackerActions url={r.name} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
