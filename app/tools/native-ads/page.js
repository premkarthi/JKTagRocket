"use client";

import React, { useState } from "react";
import styles from "../display-ads/DisplayAds.module.css";
import "./NativeAdsAddon.css";

// Dummy helpers and maps for demonstration
const eventNamesMap = {};
const pixelsTypeMap = {};
function getPiexelsType(url = "") {
    for (const key in pixelsTypeMap) {
        if (url && url.includes(key)) return pixelsTypeMap[key];
    }
    return "Unknown";
}
function getQueryParams(url) {
    let params = {};
    if (!url) return params;
    try {
        let urlObj = new URL(url);
        for (let [key, val] of urlObj.searchParams.entries()) {
            params[key] = val;
        }
    } catch (e) {
        // fallback for URLs not parseable by new URL
        let query = url.split('?')[1] || '';
        query.split('&').forEach(pair => {
            let [k, v] = pair.split('=');
            if (k) params[k] = decodeURIComponent(v || '');
        });
    }
    return params;
}
function randomString(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
}

const TABS = [
    { label: "Native Ad Information" },
    { label: "Trackers / Pixel's" },
    // { label: "Pixel's" },
];

// TooltipButton component for clipboard with tooltip & copied
function TooltipCopyButton({ value }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (value) {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        }
    };

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
                        background: "7543e0",
                        color: "#fff",
                        borderRadius: "5px",
                        padding: "6px 12px",
                        fontSize: "15px",
                        whiteSpace: "nowrap",
                        zIndex: 10,
                        pointerEvents: "none",
                        transition: "opacity 0.25s ease",
                        zIndex: 10000,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                        fontFamily: "sans-serif",
                        opacity: 0,
                       
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
    const [videoPreview, setVideoPreview] = useState(""); // For VAST video
    const [videoEvents, setVideoEvents] = useState([]); // For VAST video tracker table

    // Data signals
    const [dataSignals, setDataSignals] = useState([]);
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
        setEventTrackers([]);
        setPixelsTable([]);
        setError("");
        setIsSubmitted(false);
        setVideoPreview("");
        setVideoEvents([]);
        setDataSignals([]);
    };

    async function fetchNativeDataWithFallback(url) {
        let dataType = url.includes("jsonp") ? "jsonp" : "json";
        let tries = 0;
        let lastError = null;

        while (tries < 2) {
            try {
                const response = await fetch(url);
                const text = await response.text();
                if (
                    dataType === "jsonp" ||
                    /^[a-zA-Z_][\w\d_]*\(/.test(text.trim())
                ) {
                    const match = text.trim().match(/^[a-zA-Z_][\w\d_]*\(\s*([\s\S]*)\s*\);?$/);
                    if (match && match[1]) {
                        return JSON.parse(match[1]);
                    } else {
                        throw new Error("Failed to parse JSONP response");
                    }
                } else {
                    return JSON.parse(text);
                }
            } catch (err) {
                lastError = err;
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

    function buildNativeData(res, url) {
        let data = {};
        let _videoPreview = "";
        let _videoEvents = [];

        if (res.assets !== undefined) {
            let queryString = new URLSearchParams(url);
            let paramsMap = [];
            let partnerId = "";
            for (let pair of queryString.entries()) {
                if (pair[0].indexOf('ap_DataSignal') > -1) {
                    paramsMap.push(pair.join('=').replace('ap_', ''));
                } else if (pair[0].indexOf('partnerId') > -1) {
                    if (pair.join('=').indexOf("TL") > -1) {
                        partnerId = "TripleLift";
                    } else if (pair.join('=').indexOf("ST") > -1) {
                        partnerId = "ShareThrough";
                    } else if (pair.join('=').indexOf("TB") > -1) {
                        partnerId = "Taboola";
                    }
                }
            }
            data.partnerId = partnerId;
            data.datasignals = paramsMap;
            setNativeSsp(partnerId);
            setDataSignals(paramsMap);

            res.assets.forEach(obj => {
                if (obj.title !== undefined) {
                    data.title = obj.title.text;
                    setHeadline(obj.title.text);
                } else if (obj.data !== undefined) {
                    if (obj.data.type == 2 || obj.data.type == '2') {
                        data.subtitle = obj.data.value;
                        setDescription(obj.data.value);
                    } else if (obj.data.type == 1 || obj.data.type == '1') {
                        data.brandName = obj.data.value;
                        setBrandName(obj.data.value);
                    }
                } else if (obj.img !== undefined) {
                    if (obj.img.type == 1 || obj.img.type == '1') {
                        data.logo = obj.img.url;
                        setBrandLogo(obj.img.url);
                    } else if (obj.img.type == 2 || obj.img.type == '2') {
                        data.preview = obj.img.url;
                        setImagevideoPreview(obj.img.url);
                    } else if (obj.img.type == 3 || obj.img.type == '3') {
                        data.preview = obj.img.url;
                        setImagevideoPreview(obj.img.url);
                    }
                } else if (obj.video !== undefined) {
                    let tag = obj.video.vasttag;
                    let first_index = tag.search(/<MediaFile/);
                    let last_index = tag.search(/<\/MediaFile>/) + 12;
                    let content = tag.substring(first_index, last_index);
                    let parser = new window.DOMParser();
                    // let xmlDoc = parser.parseFromString(content, "text/xml");
                    // let videoUrl = xmlDoc.getElementsByTagName("MediaFile")[0]?.textContent?.trim();
                     const xmlDoc = parser.parseFromString(content, "text/xml");
                        const mediaTag = xmlDoc.getElementsByTagName("MediaFile")[0];
                        const videoUrl = mediaTag?.textContent?.trim();
                    if (videoUrl) {
                        // _videoPreview = `<video width="340" src="${videoUrl}" muted autoPlay controls></video>`;
                        const _videoPreview = `<video width="340" src="${videoUrl}" muted autoplay controls playsinline></video>`;
                        setImagevideoPreview(videoUrl);
                        {imagevideoPreview && (
                        <video
                            width="340"
                            src={imagevideoPreview}
                            muted
                            autoPlay
                            controls
                            playsInline
                            style={{ marginTop: "1rem", borderRadius: "8px" }}
                        />
                        )}
                    }
                    let fullXmlDoc = parser.parseFromString(tag, "text/xml");
                    let videoEventsArr = [];
                    let eventsSno = 1;
                    let trackingEventsNode = fullXmlDoc.getElementsByTagName('TrackingEvents')[0];
                    if (trackingEventsNode) {
                        Array.from(trackingEventsNode.children).forEach(e => {
                            videoEventsArr.push({
                                sno: eventsSno++,
                                eventId: e.getAttribute('event'),
                                eventName: eventNamesMap[e.getAttribute('event')] || e.getAttribute('event')
                            });
                        });
                    }
                    let impressions = fullXmlDoc.getElementsByTagName('Impression');
                    for (let idx = 0; idx < impressions.length; idx++) {
                        let el = impressions[idx];
                        let eventURL = el?.textContent?.trim();
                        let params = getQueryParams(eventURL);
                        videoEventsArr.push({
                            sno: eventsSno++,
                            eventId: params['eventType'] || "Impression",
                            eventName: eventNamesMap[params['eventType']] || params['eventType'] || "Impression"
                        });
                    }
                    _videoEvents = videoEventsArr;
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
                        data.click_tracker = clickTrackerStr;
                        data.click_url = clickUrlStr;
                        setPrimaryClickTracker(clickTrackerStr);
                        setSecondaryClickTracker(clickUrlStr);
                    } catch (e) {
                        console.error("Error in decription =>" + e);
                    }
                }
            });
        }
        setVideoPreview(_videoPreview);
        setVideoEvents(_videoEvents);

        if (res.eventtrackers !== undefined) {
            const events = [];
            const pixels = [];
            let pixelSno = 1;
            res.eventtrackers.forEach(obj => {
                let url = obj.url;
                if (url !== undefined) {
                    if (url.indexOf("trackimp") > -1) {
                        setImpressionTracker(url);
                    }
                    events.push({
                        sno: pixelSno,
                        type: getPiexelsType ? getPiexelsType(url) : "Unknown",
                        url: url || "",
                        creative: ""
                    });
                    pixels.push({
                        sno: pixelSno,
                        type: getPiexelsType ? getPiexelsType(url) : "Unknown",
                        url: url || "",
                        creative: ""
                    });
                    pixelSno++;
                }
            });
            setEventTrackers(events);
            setPixelsTable(pixels);
        }
    }
    // Open URL in new tab with validation
    // This function is used to open the click tracker or click URL in a new tab
    // It checks if the element exists, retrieves the URL from its innerText,
    // and opens it in a new tab if it's a valid URL.
    // It also handles special cases for click trackers and click URLs.
    // If the URL contains "redirectURL", it extracts the part after it.
    // If the URL starts with "http", it opens it directly.
    // If it contains "www" or ".", it prepends "https://" before opening.
    // If the URL is empty or invalid, it does nothing.
                function openUrlInNewTab(id) {
                console.log('called');
                const element = document.getElementById(id);
                if (!element) return;

                let url = element.innerText.trim();
                
                if (id === "click_tracker" || id === "click-url-content") {
                    if (url.includes("redirectURL")) {
                        const index = url.indexOf("redirectURL");
                        url = url.substring(index + "redirectURL".length + 1);
                    }
                }

                if (url && typeof url === "string" && url !== "undefined") {
                    if (url.startsWith("http")) {
                        window.open(url, "_blank");
                    } else if (url.includes("www") || url.includes(".")) {
                        window.open("https://" + url, "_blank");
                    }
                }
            }


    // Shows NA for empty input/textarea on submit, else empty
    const fieldValue = (v) => isSubmitted && (!v || v.trim() === "") ? "NA" : v;

    const isImageUrl = (url) =>
        typeof url === "string" && /\.(jpe?g|png|gif|svg|webp)$/i.test(url);
    const isVideoUrl = (url) =>
        typeof url === "string" && /\.(mp4|webm|ogg)$/i.test(url);

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
                    placeholder=" Paste your Native tag here ... !!!"
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
                        Reset
                    </button>
                    <button
                        className={styles.displayAdsPreviewBtn + " nativeAdsSubmitBtn"}
                        type="button"
                        onClick={handleSubmit}
                    >
                        Submit
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
                    {tab === 0 && (
                        <div>
                            <div className="nativeAdsFieldRow">
                                <label className="nativeAdsFieldLabel">Native SSP : </label>
                                <div className="nativeAdsFieldInputWrapper">
                                    <input
                                        type="text"
                                        value={fieldValue(nativeSsp)}
                                        onChange={e => setNativeSsp(e.target.value)}
                                        className="nativeAdsFieldInput"
                                        placeholder="Native SSP"
                                    />
                                    <TooltipCopyButton value={nativeSsp} />
                                </div>
                            </div>
                            {/* <div className="nativeAdsFieldRow">
                                <label className="nativeAdsFieldLabel">Data Signals</label>
                                <div className="nativeAdsFieldInputWrapper">
                                    <textarea
                                        value={fieldValue(dataSignals.join("\n"))}
                                        readOnly
                                        className="nativeAdsFieldInput"
                                        rows={2}
                                    />
                                </div>
                            </div> */}
                            <div className="nativeAdsFieldRow">
                                <label className="nativeAdsFieldLabel">Headline ( Title ) :</label>
                                <div className="nativeAdsFieldInputWrapper">
                                    <input
                                        type="text"
                                        value={fieldValue(headline)}
                                        onChange={e => setHeadline(e.target.value)}
                                        className="nativeAdsFieldInput"
                                        placeholder="Headline ( Title )"
                                    />
                                    <TooltipCopyButton value={headline} />
                                </div>
                            </div>
                            <div className="nativeAdsFieldRow">
                                <label className="nativeAdsFieldLabel">Sub Headline / Description :</label>
                                <div className="nativeAdsFieldInputWrapper">
                                    <textarea
                                        value={fieldValue(description)}
                                        onChange={e => setDescription(e.target.value)}
                                        className="nativeAdsFieldInput"
                                        rows={2}
                                        placeholder="Sub Headline / Description"
                                    />
                                    <TooltipCopyButton value={description} />
                                </div>
                            </div>
                            <div className="nativeAdsFieldRow">
                                <label className="nativeAdsFieldLabel">Brand Name : </label>
                                <div className="nativeAdsFieldInputWrapper">
                                    <input
                                        type="text"
                                        value={fieldValue(brandName)}
                                        onChange={e => setBrandName(e.target.value)}
                                        className="nativeAdsFieldInput"
                                        placeholder="Brand Name"
                                    />
                                    <TooltipCopyButton value={brandName} />
                                </div>
                            </div>
                            <div className="nativeAdsFieldRow">
                                <label className="nativeAdsFieldLabel">Reporting Name :</label>
                                <div className="nativeAdsFieldInputWrapper">
                                    <input
                                        type="text"
                                        value={fieldValue(reportingName)}
                                        onChange={e => setReportingName(e.target.value)}
                                        className="nativeAdsFieldInput"
                                        placeholder="Reporting Name"
                                    />
                                    <TooltipCopyButton value={reportingName} />
                                </div>
                            </div>
                            <div className="nativeAdsFieldRow">
                                <label className="nativeAdsFieldLabel">Impression Tracker :</label>
                                <div className="nativeAdsFieldInputWrapper">
                                    <input
                                        type="text"
                                        value={fieldValue(impressionTracker)}
                                        onChange={e => setImpressionTracker(e.target.value)}
                                        className="nativeAdsFieldInput"
                                        placeholder="Impression Tracker"
                                    />
                                    <TooltipCopyButton value={impressionTracker} />
                                    <span>
                                    <img onclick="openUrlInNewTab('impressionTracker')" class="open-new-tab-icon" src="/images/open-new-tab.jpeg" data-title="Click to open url in new tab"/>
                                    </span>
                                </div>
                            </div>
                            <div className="nativeAdsFieldRow">
                                <label className="nativeAdsFieldLabel">Secondary Click Tracker :</label>
                                <div className="nativeAdsFieldInputWrapper">
                                    <input
                                        type="text"
                                        value={fieldValue(secondaryClickTracker)}
                                        onChange={e => setSecondaryClickTracker(e.target.value)}
                                        className="nativeAdsFieldInput"
                                        placeholder="Secondary Click Tracker"
                                    />
                                    <TooltipCopyButton value={secondaryClickTracker} />
                                    <span>
                                    <img onclick="openUrlInNewTab('secondaryClickTracker')" class="open-new-tab-icon" src="/images/open-new-tab.jpeg" data-title="Click to open url in new tab"/>
                                    </span>
                                </div>
                            </div>
                            <div className="nativeAdsFieldRow">
                                
                                <label className="nativeAdsFieldLabel">Primary Click Tracker :</label>
                                <div className="nativeAdsFieldInputWrapper">
                                    <input
                                        type="text"
                                        value={fieldValue(primaryClickTracker)}
                                        onChange={e => setPrimaryClickTracker(e.target.value)}
                                        className="nativeAdsFieldInput"
                                        placeholder="Primary Click Tracker"
                                    />
                                    <TooltipCopyButton value={primaryClickTracker} />
                                    <span>
                                    <img onclick="openUrlInNewTab('primaryClickTracker')" class="open-new-tab-icon" src="/images/open-new-tab.jpeg" data-title="Click to open url in new tab"/>
                                    </span>
                                </div>
                                
                            </div>
                            <div className="nativeAdsFieldRow" style={{ alignItems: "flex-start" }}>
                                <label className="nativeAdsFieldLabel">Brand Logo :</label>
                                <div className="nativeAdsFieldInput" placeholder="Brand Logo">
                                    {brandLogo && isImageUrl(brandLogo) ? (
                                        <img
                                            src={brandLogo}
                                            alt="Logo"
                                            style={{ maxHeight: 60, maxWidth: 180, borderRadius: 7, border: "1px solid #eee" }}
                                            onError={e => (e.target.style.display = 'none')}
                                            placeholder="Brand Logo"
                                        />
                                    ) : (
                                        <div className="">{fieldValue(brandLogo)}</div>
                                        
                                    )}
                                </div>
                            </div>

                            {(isImageUrl(imagevideoPreview) || isVideoUrl(imagevideoPreview)) && (
                                <div className="nativeAdsFieldRow" style={{ alignItems: "flex-start", marginTop: 32 }}>
                                    <label className="nativeAdsFieldLabel" >Image / Video Preview :</label>
                                    <div className="nativeAdsFieldInputWrapper" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                                        {isImageUrl(imagevideoPreview) && (
                                            <img
                                                src={imagevideoPreview}
                                                alt="Preview"
                                                style={{ maxHeight: 250, maxWidth: 400, marginBottom: 6 }}
                                                onError={e => (e.target.style.display = 'none')}
                                                placeholder="Image / Video Preview"
                                            />
                                        )}
                                        {isVideoUrl(imagevideoPreview) && (
                                            <video
                                                src={imagevideoPreview}
                                                controls
                                                style={{ maxHeight: 250, maxWidth: 400, marginBottom: 6 }}
                                            />
                                        )}
                                        <div >
                                            <div style={{
                                                fontSize: "1.5em",
                                                marginBottom: 2,
                                                color: "#556677"
                                            }}>{fieldValue(headline)}</div>
                                            <div style={{
                                                color: "#e968f7",
                                                fontSize: "1.1em"
                                            }}>{fieldValue(description)}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                    {/* Tab 1: Trackers */}
                    {tab === 1 && (
                        <table className="nativeAdsTable">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Pixel URL</th>
                                    <th>Action</th>
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
                                            <td style={{ wordBreak: "break-all" }}>{url || ""}</td>
                                            {/* <td>{creative || ""}</td> */}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                    {/* {tab === 2 && (
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
                    )} */}
                </div>
            </div>
        </div>
    );
}