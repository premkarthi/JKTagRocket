"use client";

import React, { useState } from "react";
import styles from "../display-ads/DisplayAds.module.css";
import "./NativeAdsAddon.css";
import Image from 'next/image';

// Dummy helpers and maps for demonstration
const eventNamesMap = {};
const pixelsTypeMap = {};
function getPiexelsType(url = "") {
    for (const key in pixelsTypeMap) {
        if (url && url.includes(key)) return pixelsTypeMap[key];
    }
    return "Unknown";
}
function randomString(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
}

const TABS = [
    { label: "Native Ad Information" },
    { label: "Trackers" },
    { label: "Pixel's" },
];

// TooltipButton component for clipboard with tooltip & copied
function TooltipCopyButton({ value }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [copied, setCopied] = useState(false);

    // Handles copying and showing "Copied!" for 1.2s
    const handleCopy = () => {
        if (value) {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        }
    };

    // Tooltip text: show "Copy" on hover, "Copied!" after click
    const tooltipText = copied ? "Copied!" : "Copy";

    return (
        <span
            className="nativeAdsCopyBtnWrapper"
            style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => { setShowTooltip(false); setCopied(false); }}
        >
            <button
                type="button"
                className="nativeAdsCopyBtn"
                aria-label="Copy"
                onClick={handleCopy}
                tabIndex={0}
            >
                <span role="img" aria-label="Copy">📋</span>
            </button>
            {showTooltip && (
                <span
                    className="nativeAdsCopyTooltip"
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "-34px",
                        transform: "translateX(-50%)",
                        background: "#444",
                        color: "#fff",
                        borderRadius: "5px",
                        padding: "2px 9px",
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                        zIndex: 10,
                        pointerEvents: "none"
                    }}
                >
                    {tooltipText}
                </span>
            )}
        </span>
    );
}

export default function NativeAds() {
    const [nativeTag, setNativeTag] = useState("");
    const [tab, setTab] = useState(0);

    // Info fields
    const [nativeSsp, setNativeSsp] = useState("");
    const [headline, setHeadline] = useState("");
    const [description, setDescription] = useState("");
    const [brandName, setBrandName] = useState("");
    const [reportingName, setReportingName] = useState("");
    const [impressionTracker, setImpressionTracker] = useState("");
    const [secondaryClickTracker, setSecondaryClickTracker] = useState("");
    const [primaryClickTracker, setPrimaryClickTracker] = useState("");
    const [brandLogo, setBrandLogo] = useState("");
    const [imagevideoPreview, setImagevideoPreview] = useState("");

    // Extra fields
    const [segment, setSegment] = useState("");
    const [reportingSchema, setReportingSchema] = useState("");
    const [dbAttributes, setDbAttributes] = useState("");
    const [reportedBy, setReportedBy] = useState("");

    // Trackers/Pixels
    const [eventTrackers, setEventTrackers] = useState([]);
    const [pixelsTable, setPixelsTable] = useState([]);

    // Feedback
    const [error, setError] = useState("");
    // isSubmitted is true after a successful fetch/parse
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleReset = () => {
        setNativeTag("");
        setNativeSsp("");
        setHeadline("");
        setDescription("");
        setBrandName("");
        setReportingName("");
        setImpressionTracker("");
        setSecondaryClickTracker("");
        setPrimaryClickTracker("");
        setBrandLogo("");
        setImagevideoPreview("");
        setSegment("");
        setReportingSchema("");
        setDbAttributes("");
        setReportedBy("");
        setEventTrackers([]);
        setPixelsTable([]);
        setError("");
        setIsSubmitted(false);
    };

    // Core logic: mimic your $.ajax and fallback cycle, handling JSONP if needed
    async function fetchNativeDataWithFallback(url) {
        let dataType = url.includes("jsonp") ? "jsonp" : "json";
        let tries = 0;
        let lastError = null;

        while (tries < 2) {
            try {
                const response = await fetch(url);
                const text = await response.text();

                // Try to parse as JSONP if it looks like JSONP, otherwise as JSON
                if (
                    dataType === "jsonp" ||
                    /^[a-zA-Z_][\w\d_]*\(/.test(text.trim())
                ) {
                    // JSONP: doDco({...});
                    const match = text.trim().match(/^[a-zA-Z_][\w\d_]*\(\s*([\s\S]*)\s*\);?$/);
                    if (match && match[1]) {
                        return JSON.parse(match[1]);
                    } else {
                        throw new Error("Failed to parse JSONP response");
                    }
                } else {
                    // Standard JSON
                    return JSON.parse(text);
                }
            } catch (err) {
                lastError = err;
                // Fallback logic: switch dataType and URL as in your code
                if (dataType === "jsonp") {
                    dataType = "json";
                    url = url.replace("jsonp", "json");
                } else if (dataType === "json") {
                    dataType = "jsonp";
                    url = url.replace("json", "jsonp");
                } else {
                    break;
                }
                tries++;
            }
        }
        throw lastError || new Error("Failed to fetch native data");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!nativeTag.trim()) {
            setError("No tag available");
            return;
        }

        let url = nativeTag.trim();
        url = url.replaceAll(new RegExp('&r=(.*?)\\&', 'gi'), '&r=' + randomString() + '&')
            .replaceAll(new RegExp('&amp;r=(.*?)\\&amp;', 'gi'), '&amp;r=' + randomString() + '&amp;')
            .replaceAll(new RegExp('&cMacro=(.*?)\\&', 'gi'), '&cMacro=&')
            .replaceAll(new RegExp('&amp;cMacro=(.*?)\\&amp;', 'gi'), '&amp;cMacro=&amp;');
        let dataType = "json";
        if (url.indexOf("jsonp") > -1) {
            dataType = "json";
        }
        try {
            const nativeData = await fetchNativeDataWithFallback(url, dataType);
            buildNativeData(nativeData, url);
            setIsSubmitted(true);
        } catch (err) {
            setError("Failed to load or parse native data.");
        }
    };

    // buildNativeData: parses the response object and updates React state
    function buildNativeData(res, url) {
        const queryString = new URLSearchParams(url);
        let partnerId = "";
        let paramsMap = [];
        for (let pair of queryString.entries()) {
            if (pair[0].indexOf('ap_DataSignal') > -1) {
                paramsMap.push(pair.join('=').replace('ap_', ''));
            } else if (pair[0].indexOf('partnerId') > -1) {
                if (pair[1].indexOf("TL") > -1) partnerId = "TripleLift";
                else if (pair[1].indexOf("ST") > -1) partnerId = "ShareThrough";
                else if (pair[1].indexOf("TB") > -1) partnerId = "Taboola";
            }
        }
        setNativeSsp(partnerId);

        // Asset parsing
        let title = "";
        let subtitle = "";
        let brand = "";
        let logoUrl = "";
        let previewUrl = "";
        let reporting = "";
        let clickTracker = "";
        let clickUrl = "";
        let segment = "";
        let reportingSchemaObj = {};
        let dbattributes = "";
        let reportedby = "";

        if (res.assets) {
            res.assets.forEach(obj => {
                if (obj.title !== undefined) {
                    title = obj.title.text;
                } else if (obj.data !== undefined) {
                    if (obj.data.type == 2 || obj.data.type == '2') {
                        subtitle = obj.data.value;
                    } else if (obj.data.type == 1 || obj.data.type == '1') {
                        brand = obj.data.value;
                    }
                } else if (obj.img !== undefined) {
                    const img = obj.img;
                    if (img.type == 1 || img.type == '1') logoUrl = img.url;
                    else if (img.type == 2 || img.type == '2') previewUrl = img.url;
                    else if (img.type == 3 || img.type == '3') previewUrl = img.url;
                } else if (obj.link !== undefined) {
                    let clickTrackerStr = "";
                    try {
                        clickTrackerStr = obj.link.clicktrackers[0].length === 1 ? obj.link.clicktrackers : obj.link.clicktrackers[0];
                    } catch (e) { }
                    let clickUrlStr = obj.link.url[0].length === 1 ? obj.link.url : obj.link.url[0];
                    if (clickUrlStr.indexOf("es_encParams_") > -1) {
                        [clickTrackerStr, clickUrlStr] = [clickUrlStr, clickTrackerStr];
                    }
                    try {
                        let part = clickTrackerStr.split('es_encParams_');
                        let decodedString = decodeURIComponent(atob(part[1])).replace(/\+/g, ' ');
                        clickTracker = clickTrackerStr;
                        clickUrl = clickUrlStr;
                        let codeList = decodedString.split("/");
                        for (let i = 0; i < codeList.length; i++) {
                            let val = codeList[i];
                            if (val.indexOf("es_segName") > -1) {
                                segment = val.split("=")[1];
                            } else if (val.indexOf("es_cgName") > -1) {
                                reporting = val.split("=")[1];
                            } else if (val.indexOf("reportedBy") > -1) {
                                reportedby = val.split("=")[1];
                            } else if (val.indexOf("adb1-id_version") > -1) {
                                dbattributes = val.split("=")[1];
                            } else if (val.indexOf("sgrk_") > -1) {
                                const [key, value] = val.split("=");
                                reportingSchemaObj[key.replace("sgrk_", "")] = value;
                            }
                        }
                    } catch (e) { }
                }
            });
        }

        setHeadline(title ?? "");
        setDescription(subtitle ?? "");
        setBrandName(brand ?? "");
        setReportingName(reporting ?? "");
        setImpressionTracker(res.impr_tracker ?? "");
        setPrimaryClickTracker(clickTracker ?? "");
        setSecondaryClickTracker(clickUrl ?? "");
        setBrandLogo(logoUrl ?? "");
        setImagevideoPreview(previewUrl ?? "");
        setSegment(segment ?? "");
        setReportingSchema(
            Object.keys(reportingSchemaObj).length
                ? Object.keys(reportingSchemaObj)
                    .map((k) => `${k} = ${reportingSchemaObj[k]}`)
                    .join("; ")
                : ""
        );
        setDbAttributes(dbattributes ?? "");
        setReportedBy(reportedby ?? "");

        // Eventtrackers and Pixels Table
        if (res.eventtrackers) {
            // Build eventtrackers table
            const events = [];
            const pixels = [];
            let pixelSno = 1;
            res.eventtrackers.forEach(obj => {
                let url = obj.url;
                events.push({
                    sno: pixelSno,
                    type: getPiexelsType ? getPiexelsType(url) : "Unknown",
                    url: url || "",
                    creative: "" // Fill if you want, see your original code for creative extraction
                });
                pixels.push({
                    sno: pixelSno,
                    type: getPiexelsType ? getPiexelsType(url) : "Unknown",
                    url: url || "",
                    creative: "" // Fill if needed
                });
                pixelSno++;
            });
            setEventTrackers(events);
            setPixelsTable(pixels);
        }
    }

    // For input/textarea: keep empty by default, after submit show NA if empty
    const fieldValue = (v) => isSubmitted && (!v || v.trim() === "") ? "NA" : v;

    return (
        <div className={styles.displayAdsContainer + " nativeAdsContainer"}>
            <h1 className={styles.displayAdsHeader + " nativeAdsHeader"}>
                Native Ads Creator
            </h1>
            <div className={styles.displayAdsSubtitle + " nativeAdsSubtitle"}>
                Create and preview native ad formats with custom content
            </div>
            <div className={styles.displayAdsInputCard + " nativeAdsInputCard"}>
                <label htmlFor="nativeTag" className={styles.displayAdsInputLabel}>
                    Paste your link
                </label>
                <textarea
                    id="nativeTag"
                    rows={6}
                    placeholder="Paste your Native tag here ...!!!"
                    value={nativeTag}
                    onChange={e => setNativeTag(e.target.value)}
                    className={styles.displayAdsTextarea}
                />
                <div className={styles.displayAdsButtonGroup}>
                    <button
                        className={styles.displayAdsResetBtn + " nativeAdsResetBtn"}
                        type="button"
                        onClick={handleReset}
                    >
                        ❌ Reset
                    </button>
                    <button
                        className={styles.NativeAdsAdsPreviewBtn}
                        // onClick={handlePreview}
                        type="button"
                    >
                        JSON Response
                    </button>
                    <button
                        className={styles.displayAdsPreviewBtn + " nativeAdsSubmitBtn"}
                        type="button"
                        onClick={handleSubmit}
                    >
                        👁️ Submit
                    </button>
                </div>
                {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
            </div>
            <div className="nativeAdsTabsWrapper">
                <div className="nativeAdsTabs">
                    {TABS.map((t, idx) => (
                        <button
                            key={t.label}
                            className={
                                tab === idx ? "nativeAdsTab nativeAdsTabActive" : "nativeAdsTab"
                            }
                            onClick={() => setTab(idx)}
                            type="button"
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="nativeAdsTabPanel">
                    {/* Tab 0: Native Ad Information */}
                    {tab === 0 && (
                        <div>
                            {[
                                ["Native SSP", nativeSsp, setNativeSsp],
                                ["Headline ( Title )", headline, setHeadline],
                                ["Sub Headline / Description", description, setDescription, true],
                                ["Brand Name", brandName, setBrandName],
                                ["Reporting Name", reportingName, setReportingName],
                                ["Impression Tracker", impressionTracker, setImpressionTracker],
                                ["Secondary Click Tracker", secondaryClickTracker, setSecondaryClickTracker],
                                ["Primary Click Tracker", primaryClickTracker, setPrimaryClickTracker],
                                ["Brand Logo", brandLogo, setBrandLogo],
                                ["Image / Video Preview", imagevideoPreview, setImagevideoPreview]
                            ].map(([label, value, setter, multiline], idx) => (
                                <div className="nativeAdsFieldRow" key={label}>
                                    <label className="nativeAdsFieldLabel">{label}</label>
                                    <div className="nativeAdsFieldInputWrapper">
                                        {multiline ? (
                                            <textarea
                                                value={fieldValue(value)}
                                                onChange={e => setter(e.target.value)}
                                                className="nativeAdsFieldInput"
                                                rows={2}
                                                placeholder={label}
                                            />
                                        ) : label.toLowerCase().includes("logo") && value ? (
                                            <Image src={value} alt="Logo" style={{ maxHeight: 60 }} />
                                        ) : label.toLowerCase().includes("preview") && value ? (
                                            <Image src={value} alt="Preview" style={{ maxHeight: 250 }} />
                                        ) : (
                                            <input
                                                type="text"
                                                value={fieldValue(value)}
                                                onChange={e => setter(e.target.value)}
                                                className="nativeAdsFieldInput"
                                                placeholder={label}
                                            />
                                        )}
                                        {!label.toLowerCase().includes("logo") &&
                                            !label.toLowerCase().includes("preview") && (
                                                <TooltipCopyButton value={value} />
                                            )}
                                    </div>
                                </div>
                            ))}
                            {/* // <div className="nativeAdsFieldRow">
                            //     <label className="nativeAdsFieldLabel">Segment</label>
                            //     <div className="nativeAdsFieldInputWrapper">
                            //         <input type="text" value={fieldValue(segment)} readOnly className="nativeAdsFieldInput" />
                            //     </div>
                            // </div>
                            // <div className="nativeAdsFieldRow">
                            //     <label className="nativeAdsFieldLabel">Reporting Schema</label>
                            //     <div className="nativeAdsFieldInputWrapper">
                            //         <input type="text" value={fieldValue(reportingSchema)} readOnly className="nativeAdsFieldInput" />
                            //     </div>
                            // </div>
                            // <div className="nativeAdsFieldRow">
                            //     <label className="nativeAdsFieldLabel">DB Attributes</label>
                            //     <div className="nativeAdsFieldInputWrapper">
                            //         <input type="text" value={fieldValue(dbAttributes)} readOnly className="nativeAdsFieldInput" />
                            //     </div>
                            // </div>
                            // <div className="nativeAdsFieldRow">
                            //     <label className="nativeAdsFieldLabel">Reported By</label>
                            //     <div className="nativeAdsFieldInputWrapper">
                            //         <input type="text" value={fieldValue(reportedBy)} readOnly className="nativeAdsFieldInput" />
                            //     </div>
                            // </div> */}
                        </div>
                    )}
                    {/* Tab 1: Trackers */}
                    {tab === 1 && (
                        <table className="nativeAdsTable">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Type</th>
                                    <th>Pixel URL</th>
                                    <th>Creative Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventTrackers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: "center" }}>No Data</td>
                                    </tr>
                                ) : (
                                    eventTrackers.map(({ sno, type, url, creative }) => (
                                        <tr key={sno}>
                                            <td>{sno || ""}</td>
                                            <td>{type || ""}</td>
                                            <td style={{ wordBreak: "break-all" }}>{url || ""}</td>
                                            <td>{creative || ""}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                    {/* Tab 2: Pixel's */}
                    {tab === 2 && (
                        <table className="nativeAdsTable">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Type</th>
                                    <th>Pixel URL</th>
                                    <th>Creative Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pixelsTable.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: "center" }}>No Data</td>
                                    </tr>
                                ) : (
                                    pixelsTable.map(({ sno, type, url, creative }) => (
                                        <tr key={sno}>
                                            <td>{sno || ""}</td>
                                            <td>{type || ""}</td>
                                            <td style={{ wordBreak: "break-all" }}>{url || ""}</td>
                                            <td>{creative || ""}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
