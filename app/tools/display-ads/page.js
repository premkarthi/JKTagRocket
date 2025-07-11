"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./DisplayAds.module.css";
import Faq from "../../../components/Faq";
import NetworkTimelineChart from "./NetworkTimelineChart";
import PerformanceSummaryBlock from "./PerformanceSummaryBlock";
import { RESOURCE_TYPE_FILTERS, getResourceType } from "./utils";
import computePerformanceSummary from "./computePerformanceSummary";
import { useAutoDismissMessage, getIcon } from "../../../components/useMessages";
import "../../../styles/globals.css";



function splitAdBlocks(input) {
  const blockRegex = /<script[\s\S]*?<\/script>|<ins[\s\S]*?<\/ins>|<div[\s\S]*?<\/div>/gi;
  let blocks = input.match(blockRegex) || [];
  input
    .replace(blockRegex, "")
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

function buildTimeline(res) {
  return res.map((r) => ({
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
  if (!res.ok) throw new Error("capture failed");
  return res.json();
}

export default function DisplayAds() {
  const [adCode, setAdCode] = useState("");
  const [adBlocks, setAdBlocks] = useState([]);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [iframeH, setIframeH] = useState([]);
  const [previewLoaded, setPreviewLoaded] = useState([]);
  const [networkLoaded, setNetworkLoaded] = useState([]);
  const [netData, setNetData] = useState([]);
  const [filters, setFilters] = useState([]);
  const [modal, setModal] = useState({ idx: null, call: null });
  const frames = useRef([]);
  const [deepCapture, setDeep] = useState(false);
  const [message, setMessage] = useAutoDismissMessage();

  const reset = () => {
    setAdCode("");
    setAdBlocks([]);
    setShow(false);
    setError("");
    setIframeH([]);
    setPreviewLoaded([]);
    setNetworkLoaded([]);
    setNetData([]);
    setFilters([]);
    setModal({ idx: null, call: null });
    frames.current = [];
    setMessage({ type: "info", text: " Reset successful — All inputs and previews have been cleared.." });
  };

  const preview = () => {
    if (!adCode.trim()) {
      return setMessage({ type: "warning", text: " Please enter a valid dispaly tag's before submitting.." });
    }
    const blocks = splitAdBlocks(adCode.trim());
    for (const b of blocks) {
      const e = validateAdBlock(b);
      if (e) return setMessage({ type: "error", text: e });
    }
    setAdBlocks(blocks);
    setShow(true);
    setError("");
    setIframeH(Array(blocks.length).fill(320));
    setPreviewLoaded(Array(blocks.length).fill(false));
    setNetworkLoaded(Array(blocks.length).fill(!deepCapture));
    setNetData(
      blocks.map(() => ({
        resources: [],
        timings: {},
        summary: null,
        timeline: []
      }))
    );
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
        const html = `<!doctype html><html><body>${/^(https?:)?\/\//i.test(b.trim()) ? `<script src="${b.trim()}"></script>` : b}</body></html>`;
        try {
          const { calls, perf } = await captureServerSide(html);
          setNetData((p) => {
            const n = [...p];
            n[i] = {
              resources: calls,
              timings: perf,
              summary: computePerformanceSummary(calls, perf),
              timeline: buildTimeline(calls),
            };
            return n;
          });
        } finally {
          setNetworkLoaded((p) => {
            const n = [...p];
            n[i] = true;
            return n;
          });
        }
      });
    }
    setMessage({ type: "success", text: " Dispaly ad's Previews are loaded successfully" });
  };

  useEffect(() => {
    const h = (e) => {
      const { type, iframeIdx } = e.data || {};
      if (type === "ad-iframe-image-size") {
        setIframeH((p) => {
          const n = [...p];
          n[iframeIdx] = Math.max(200, e.data.height + 32);
          return n;
        });
        setPreviewLoaded((p) => {
          const n = [...p];
          n[iframeIdx] = true;
          return n;
        });
      }
      if (type === "ad-iframe-network-data") {
        setNetData((p) => {
          const n = [...p];
          n[iframeIdx] = {
            resources: e.data.resources,
            timings: e.data.timings,
            summary: computePerformanceSummary(
              e.data.resources,
              e.data.timings
            ),
            timeline: buildTimeline(e.data.resources),
          };
          return n;
        });
        setNetworkLoaded((p) => {
          const n = [...p];
          n[iframeIdx] = true;
          return n;
        });
      }
    };
    window.addEventListener("message", h);
    return () => window.removeEventListener("message", h);
  }, []);

  useEffect(() => {
    if (!show) return;
    adBlocks.forEach((blk, i) => {
      if (!frames.current[i]) return;
      const tag = /^(https?:)?\/\//i.test(blk.trim())
        ? `<script src='${blk.trim()}'></script>`
        : blk;
      const collect = !deepCapture
        ? `<script>(function(){function send(){var r=performance.getEntriesByType('resource');
      var nav=performance.timing,t={domContentLoaded:nav.domContentLoadedEventEnd-nav.navigationStart,
      loadTime:nav.loadEventEnd-nav.navigationStart,firstPaint:(performance.getEntriesByType('paint').find(p=>p.name==='first-contentful-paint')||{}).startTime||0};
      parent.postMessage({type:'ad-iframe-network-data',iframeIdx:${i},resources:Array.from(r),timings:t},'*');}
      window.addEventListener('load',()=>setTimeout(send,1000));})();</script>`
        : "";
      const size = `<script>window.addEventListener('load',()=>parent.postMessage({type:'ad-iframe-image-size',iframeIdx:${i},height:document.body.scrollHeight},'*'));</script>`;
      frames.current[i].srcdoc = `<!doctype html><html><body>${tag}${size}${collect}</body></html>`;
    });
  }, [adBlocks, show, deepCapture]);

  return (
    <div className={styles.displayAdsContainer}>
      <h1 className={styles.displayAdsHeader}>Display Ad Tag Preview & Network Analyzer</h1>
      <p className={styles.displayAdsSubtitle}>
        Test and preview display ad tags in a secure sandbox with deep capture support ..
      </p>

      <div className={styles.displayAdsInputCard}>
        <textarea
          rows={7}
          value={adCode}
          placeholder=" 🔗 Paste your HTML/JavaScript display ad tag here to preview and inspect network calls..."
          onChange={(e) => setAdCode(e.target.value)}
          className={styles.displayAdsTextarea}
        />

        {message && (
          <div className={`user-message ${message.type}`} style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>
            <div className="user-message-icon">{getIcon(message.type)}</div>
            <div className="user-message-content">
              <span>{message.text}</span>
              <a href="#" className="user-message-action" onClick={(e) => { e.preventDefault(); setMessage(null); }}>Dismiss</a>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "flex-end", alignItems: "center" }}>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={deepCapture}
              onChange={(e) => setDeep(e.target.checked)}
            />
            <span className="slider"></span>
            <span className="label-text">Deep capture</span>
          </label>
          <button className={styles.displayAdsResetBtn} onClick={reset}>🔄 Reset</button>
          <button className={styles.displayAdsPreviewBtn} onClick={preview}>🚀 Submit Tag</button>
        </div>
      </div>

      {show && adBlocks.map((b, i) => {
        const net = netData[i] || {};
        const flt = filters[i] || {};
        const calls = net.resources?.filter((r) => flt[getResourceType(r)]) || [];
        const filteredSummary = net.summary ? computePerformanceSummary(calls, net.timings || {}) : null;

        return (
          <section key={i} className={styles.displayAdsPreviewArea}>
            <div style={{ position: "relative" }}>
              {!previewLoaded[i] && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, zIndex: 2 }}>
                  ⏳
                </div>
              )}
              <iframe
                ref={(el) => (frames.current[i] = el)}
                sandbox="allow-scripts allow-same-origin"
                style={{ width: "100%", height: iframeH[i] || 320, border: "1px solid #e5e7eb", borderRadius: 8 }}
                title={`ad-preview-${i}`}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              <h3 style={{ margin: 0 }}>Network</h3>
              {!networkLoaded[i] && <span style={{ fontSize: 12 }}>collecting…</span>}
            </div>

            <NetworkTimelineChart
              timeline={calls.map((r) => ({
                url: r.name,
                type: getResourceType(r),
                start: r.startTime || 0,
                end: r.responseEnd || 0,
                duration: (r.responseEnd || 0) - (r.startTime || 0),
              }))}
            />
            <PerformanceSummaryBlock summary={filteredSummary} />
          </section>
        );
      })}

      <Faq
        title="How do I preview an HTML / Script ad tags?"
        list={[
          "Preview an ad tags by uploading / input of the tag's HTML (script).",
          "Get a dynamic live previews of any ad size of tags.",
          "View network timelines, load times, and more with Deep capture ON.",
          "Share with clients to get feedback.",
        ]}
      />
    </div>
  );
}
