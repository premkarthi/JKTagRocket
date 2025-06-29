"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./DisplayAds.module.css";
import Faq from "../../../components/Faq";
import NetworkTimelineChart from "./NetworkTimelineChart";
import PerformanceSummaryBlock from "./PerformanceSummaryBlock";
import { RESOURCE_TYPE_FILTERS, getResourceType } from "./utils";
import computePerformanceSummary from "./computePerformanceSummary";

/* ---------- helpers ---------- */
function splitAdBlocks(input) {
    const blockRegex =
        /<script[\s\S]*?<\/script>|<ins[\s\S]*?<\/ins>|<div[\s\S]*?<\/div>/gi;
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
    return /<(script|ins|div)[\s\S]*?<\/\1>/i.test(b)
        ? null
        : "Invalid tag; must be <script>, <ins>, <div> or URL";
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

/* ---------- server capture ---------- */
async function captureServerSide(html) {
    const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
    });
    if (!res.ok) throw new Error("capture failed");
    return res.json();
}

/* ======================== COMPONENT ======================= */
export default function DisplayAds() {
    const [adCode, setAdCode] = useState("");
    const [adBlocks, setAdBlocks] = useState([]);
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);
    const [iframeH, setIframeH] = useState([]); // heights
    const [previewLoaded, setPreviewLoaded] = useState([]); // preview spinner
    const [networkLoaded, setNetworkLoaded] = useState([]); // network spinner
    const [netData, setNetData] = useState([]);
    const [filters, setFilters] = useState([]);
    const [modal, setModal] = useState({ idx: null, call: null });
    const frames = useRef([]);
    const [deepCapture, setDeep] = useState(true);

    /* -------- reset -------- */
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
    };

    /* -------- generate preview -------- */
    const preview = () => {
        if (!adCode.trim()) return setError("Paste ad tag(s) first");
        const blocks = splitAdBlocks(adCode.trim());
        for (const b of blocks) {
            const e = validateAdBlock(b);
            if (e) return setError(e);
        }
        setError("");
        setShow(true);
        setAdBlocks(blocks);
        setIframeH(Array(blocks.length).fill(320));
        setPreviewLoaded(Array(blocks.length).fill(false));
        setNetworkLoaded(Array(blocks.length).fill(!deepCapture)); // if deepCapture off we’ll load quickly
        setNetData(
            blocks.map(() => ({
                resources: [],
                timings: {},
                summary: null,
                timeline: [],
            }))
        );
        setFilters(
            blocks.map(() =>
                RESOURCE_TYPE_FILTERS.reduce(
                    (o, f) => ({ ...o, [f.label]: true }),
                    {}
                )
            )
        );

        if (deepCapture) {
            blocks.forEach(async (b, i) => {
                const html = `<!doctype html><html><body>${/^(https?:)?\/\//i.test(b.trim())
                        ? `<script src="${b.trim()}"></script>`
                        : b
                    }</body></html>`;
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
    };

    /* -------- postMessage listener -------- */
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

    /* -------- inject preview / client capture -------- */
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

    // UI color map - used for possible table, not used here
    const typeColor = {
        Images: "#60a5fa",
        JS: "#34d399",
        CSS: "#f59e0b",
        XHR: "#a78bfa",
        Font: "#fb7185",
        Other: "#9ca3af",
    };

    /* --------------------------- render --------------------------- */
    return (
        <div className={styles.displayAdsContainer}>
            {/* header */}
            <h1 className={styles.displayAdsHeader}>Display Ads</h1>
            <p className={styles.displayAdsSubtitle}>
                Paste ad tags, preview & inspect network calls
            </p>

            {/* input */}
            <div className={styles.displayAdsInputCard}>
                <textarea
                    rows={6}
                    value={adCode}
                    placeholder="<script> …"
                    onChange={(e) => setAdCode(e.target.value)}
                    className={styles.displayAdsTextarea}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                        className={styles.displayAdsPreviewBtn}
                        onClick={preview}
                    >
                        Preview
                    </button>
                    <button
                        className={styles.displayAdsResetBtn}
                        onClick={reset}
                    >
                        Reset
                    </button>
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={deepCapture}
                            onChange={(e) => setDeep(e.target.checked)}
                        />
                        Deep capture
                    </label>
                </div>
                {error && (
                    <div style={{ color: "red", marginTop: 6 }}>{error}</div>
                )}
            </div>

            {/* previews */}
            {show &&
                adBlocks.map((b, i) => {
                    const net = netData[i] || {};
                    const flt = filters[i] || {};
                    // Use filtered calls for chart and summary for consistency
                    const calls =
                        net.resources?.filter((r) => flt[getResourceType(r)]) ||
                        [];
                    // For summary, recompute using filtered calls for match with chart
                    const filteredSummary = net.summary
                        ? computePerformanceSummary(
                            calls,
                            net.timings || {}
                        )
                        : null;
                    return (
                        <section
                            key={i}
                            className={styles.displayAdsPreviewArea}
                        >
                            {/* iframe */}
                            <div style={{ position: "relative" }}>
                                {!previewLoaded[i] && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "rgba(255,255,255,0.6)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: 8,
                                            zIndex: 2,
                                        }}
                                    >
                                        ⏳
                                    </div>
                                )}
                                <iframe
                                    ref={(el) => (frames.current[i] = el)}
                                    sandbox="allow-scripts allow-same-origin"
                                    style={{
                                        width: "100%",
                                        height: iframeH[i] || 320,
                                        border: "1px solid #e5e7eb",
                                        borderRadius: 8,
                                    }}
                                />
                            </div>

                            {/* network widgets */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    marginTop: 8,
                                }}
                            >
                                <h3 style={{ margin: 0 }}>Network</h3>
                                {!networkLoaded[i] && (
                                    <span style={{ fontSize: 12 }}>
                                        collecting…
                                    </span>
                                )}
                            </div>
                            {/* Pass only filtered calls for chart and summary */}
                            <NetworkTimelineChart
                                timeline={calls.map((r) => ({
                                    url: r.name,
                                    type: getResourceType(r),
                                    start: r.startTime || 0,
                                    end: r.responseEnd || 0,
                                    duration:
                                        (r.responseEnd || 0) -
                                        (r.startTime || 0),
                                }))}
                            />
                            <PerformanceSummaryBlock summary={filteredSummary} />
                        </section>
                    );
                })}

            <Faq
                title="How do I preview an HTML5 ad?"
                list={[
                    "Upload HTML5 zip",
                    "View preview, network timeline & metrics",
                    "Share with clients",
                ]}
            />
        </div>
    );
}