"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "@styles/DisplayAds.module.css";
import "../../../styles/Nativeads.css";
import Image from "next/image";
import "../../../styles/Usemessages.css";
import "../../../styles/Customtooltip.css";
import "../../../styles/TooltipcopyButton.css";
import "../../../styles/TooltipOpenNewTabButton.css";
import Customtooltip from "components/Customtooltip";
import TooltipcopyButton from "components/TooltipcopyButton";
import TooltipOpenNewTabButton from "components/TooltipOpenNewTabButton";
import { useAutoDismissMessage, UserMessage } from "components/useMessages";
import { sendGAEvent } from "@utils/ga4";

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
const TABS = [
    { label: "📋 Native Ad Payload Details" },
    { label: "🎯 Event Trackers & Pixels" },
];


export default function NativeAds() {
    const [nativeTag, setNativeTag] = useState("");
    const [tab, setTab] = useState(0);
    const inputRef = useRef(null);
    const [message, setMessage] = useAutoDismissMessage(); // ✅ hook for feedback
    const [loading, setLoading] = useState(false); // ✅ this is correct
    const textareaRef = useRef(null); // if you want focus on reset

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
    // page scroll smooth to bottom 
    const resultRef = useRef(null);


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
        setLoading(false);
        setTab(0);
        setMessage({ type: "info", text: "Inputs cleared successfully." });
        setIsSubmitted(false);
        setVideoPreview("");
        setVideoEvents([]);
        setDataSignals([]);
        sendGAEvent({
            action: "native_reset_click",
            label: "Reset button clicked",
        });
        // ✅ Scroll & focus back to input
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150); // Give DOM a tiny bit of time to settle
    };
    function getIcon(type) {
        switch (type) {
            case "success": return "✔️";
            case "error": return "❌";
            case "warning": return "⚠️";
            case "info": default: return "ℹ️";
        }
    }
    // Custom hook to auto-dismiss messages after a timeout

    function useAutoDismissMessage(initialMessage = null, timeout = 3500) {
        const [message, setMessage] = useState(initialMessage);

        useEffect(() => {
            if (message) {
                const timer = setTimeout(() => setMessage(null), timeout);
                return () => clearTimeout(timer);
            }
        }, [message, timeout]);

        return [message, setMessage];
    }
    // Function to generate a random string for URL parameters
    function randomString(length = 8) {
        return Math.random().toString(36).substring(2, 2 + length);
    }

    async function fetchNativeDataWithFallback(url) {
        let dataType = url.includes("jsonp") ? "jsonp" : "json";
        let tries = 0;
        let lastError = null;

        while (tries < 2) {
            try {
                const response = await fetch(url);
                const text = await response.text();
                if (dataType === "jsonp" || /^[a-zA-Z_][\w\d_]*\(/.test(text.trim())) {
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
        throw lastError || new Error(" Failed to load native ad data. Please check the URL.");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!nativeTag.trim()) {
            setMessage({ type: "warning", text: " Please enter a valid Native tag URL before submitting.." });
            sendGAEvent({
                action: "native_tag_error",
                label: "Empty or invalid tag submitted",
            });
            return;
        }

        let url = nativeTag.trim();
        url = url.replaceAll(new RegExp('&r=(.*?)\\&', 'gi'), '&r=' + randomString() + '&')
            .replaceAll(new RegExp('&amp;r=(.*?)\\&amp;', 'gi'), '&amp;r=' + randomString() + '&amp;')
            .replaceAll(new RegExp('&cMacro=(.*?)\\&', 'gi'), '&cMacro=&')
            .replaceAll(new RegExp('&amp;cMacro=(.*?)\\&amp;', 'gi'), '&amp;cMacro=&amp;');

        let dataType = url.includes("jsonp") ? "jsonp" : "json";
        sendGAEvent({
            action: "native_submit_tag",
            label: "Submitted Native tag",
        });
        try {
            setLoading(true);
            const nativeData = await fetchNativeDataWithFallback(url);
            buildNativeData(nativeData, url);
            // You would call buildNativeData(nativeData, url) here
            setMessage({ type: "success", text: " Native tag processed successfully!" });
            sendGAEvent({
                action: "native_tag_success",
                label: "Tag parsed successfully",
            });
        } catch (err) {
            setMessage({ type: "error", text: " Failed to fetch or parse the native tag, Please check the URLonce .." });
            sendGAEvent({
                action: "native_tag_error",
                label: "Parsing failed",
            });
        } finally {
            setLoading(false);
        }
        setTimeout(() => {
            if (resultRef.current) {
                resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 300);
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
                    const xmlDoc = parser.parseFromString(content, "text/xml");
                    const mediaTag = xmlDoc.getElementsByTagName("MediaFile")[0];
                    const videoUrl = mediaTag?.textContent?.trim();
                    if (videoUrl) {
                        setImagevideoPreview(videoUrl);
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

    // Shows NA for empty input/textarea on submit, else empty
    const fieldValue = (v) => isSubmitted && (!v || v.trim() === "") ? "NA" : v;

    const isImageUrl = (url) =>
        typeof url === "string" && /\.(jpe?g|png|gif|svg|webp)$/i.test(url);
    const isVideoUrl = (url) =>
        typeof url === "string" && /\.(mp4|webm|ogg)$/i.test(url);
    // will track the GA4 tab switch
    const handleTabSwitch = (index) => {
        const label = index === 0 ? "Ad Preview" : "Trackers & Pixels";
        setTab(index);
        sendGAEvent({
            action: "native_tab_switch",
            category: "Native Tool",
            label,
        });
    };

    return (
        <div className={styles.nativeAdsContainer + " nativeAdsContainer"}>
            <h1 className={styles.nativeAdsHeader + " nativeAdsHeader"}> 🧾 Native Ad Inspector & Creative Preview Tool</h1>
            <div className={styles.nativeAdsSubtitle + " nativeAdsSubtitle"}>No more guessing. Understand your native tags like never before ..</div>
            <div className={styles.nativeAdsInputCard + " nativeAdsInputCard"}>
                {/* <label htmlFor="nativeTag" className={styles.nativeAdsInputLabel}>Paste your link</label> */}
                <textarea
                    ref={inputRef} // ✅ set ref here
                    id="nativeTag"
                    rows={7}
                    placeholder="  🔗  Paste your Native tag  URL / <script> tag URL here ... !!!"
                    value={nativeTag}
                    onChange={e => setNativeTag(e.target.value)}
                    className={styles.displayAdsTextarea}
                />

                {(message || loading) && (
                    <>
                        {message && (
                            <div className={`user-message ${message.type}`} style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>
                                <div className="user-message-icon">{getIcon(message.type)}</div>
                                <div className="user-message-content">
                                    <span>{message.text}</span>
                                    <a href="#" className="user-message-action" onClick={(e) => { e.preventDefault(); setMessage(null); }}>Dismiss</a>
                                </div>
                            </div>
                        )}
                        {loading && (
                            <div className="user-message info" style={{ marginTop: 16 }}>
                                <div className="user-message-icon">⏳</div>
                                <div className="user-message-content">
                                    <span>Processing tag, please wait...</span>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
                    <button className={styles.nativeAdsResetBtn + " nativeAdsResetBtn"} type="button" onClick={handleReset}>
                        🔄 Reset
                    </button>
                    <button className={styles.nativeAdsSubmitBtn + " nativeAdsSubmitBtn"} type="button" onClick={handleSubmit}>
                        🚀 Submit Tag
                    </button>
                </div>
            </div>
            <div className="nativeAdsTabsWrapper">
                <div className="nativeAdsTabs">
                    {TABS.map((t, idx) => (
                        <button
                            key={t.label}
                            className={tab === idx ? "nativeAdsTab nativeAdsTabActive" : "nativeAdsTab"}
                            // onClick={() => setTab(idx)}
                            onClick={() => handleTabSwitch(idx)}

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
                                    <Customtooltip text="Copy SSP" variant="copy">
                                        <TooltipcopyButton value={fieldValue(nativeSsp)} />
                                    </Customtooltip>
                                </div>
                            </div>
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
                                    <Customtooltip text="Copy Headline" variant="copy">
                                        <TooltipcopyButton value={fieldValue(headline)} />
                                    </Customtooltip>

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
                                    <Customtooltip text="Copy Description" variant="copy">
                                        <TooltipcopyButton value={fieldValue(description)} />
                                    </Customtooltip>

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
                                    <Customtooltip text="Copy Brand Name" variant="copy">
                                        <TooltipcopyButton value={fieldValue(brandName)} />
                                    </Customtooltip>

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
                                    <Customtooltip text="Copy ReportingName" variant="copy">
                                        <TooltipcopyButton value={fieldValue(reportingName)} />
                                    </Customtooltip>

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
                                    <Customtooltip text="Copy Impression Tracker" variant="copy">
                                        <TooltipcopyButton value={fieldValue(impressionTracker)} />
                                    </Customtooltip>
                                    <Customtooltip text="Open New Tab" variant="animated">
                                        <TooltipOpenNewTabButton url={impressionTracker} />
                                    </Customtooltip>

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
                                    <Customtooltip text="Copy SecondaryClickTracker" variant="copy">
                                        <TooltipcopyButton value={fieldValue(secondaryClickTracker)} />
                                    </Customtooltip>
                                    <Customtooltip text="Open New Tab" variant="animated">
                                        <TooltipOpenNewTabButton url={secondaryClickTracker} />
                                    </Customtooltip>

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
                                    <Customtooltip text="Copy PrimaryClickTracker" variant="copy">
                                        <TooltipcopyButton value={fieldValue(primaryClickTracker)} />
                                    </Customtooltip>
                                    <Customtooltip text="Open New Tab" variant="animated">
                                        <TooltipOpenNewTabButton url={primaryClickTracker} />
                                    </Customtooltip>

                                </div>
                            </div>
                            {/* Brand Logo: Label & input, copy, open new tab */}
                            <div className="nativeAdsFieldRow" style={{ alignItems: "flex-start" }}>
                                <label className="nativeAdsFieldLabel">Brand Logo :</label>
                                <div className="nativeAdsFieldInputWrapper" style={{ display: "flex", flexDirection: "column", gap: "10px", minHeight: 80 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, width: '100%' }}>
                                        <input
                                            type="text"
                                            value={fieldValue(brandLogo)}
                                            onChange={(e) => setBrandLogo(e.target.value)}
                                            className="nativeAdsFieldInput"
                                            placeholder="Brand Logo"
                                            style={{ minWidth: 200 }}
                                        />
                                        <Customtooltip text="Copy BrandLogo URL" variant="copy">
                                            <TooltipcopyButton value={fieldValue(brandLogo)} />
                                        </Customtooltip>
                                        <Customtooltip text="Open New Tab" variant="animated">
                                            <TooltipOpenNewTabButton url={brandLogo} />
                                        </Customtooltip>

                                    </div>
                                    {brandLogo && isImageUrl(brandLogo) && (
                                        <Image
                                            src={brandLogo}
                                            alt="Logo Preview"
                                            style={{
                                                maxHeight: 60,
                                                maxWidth: 180,
                                                borderRadius: 7,
                                                border: "1px solid #eee"
                                            }}
                                            height={60}
                                            width={180}
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                            {/* Image/Video Preview: Input, Copy, Open Tab all use same value, tools in a row */}
                            <div className="nativeAdsFieldRow" style={{ alignItems: "flex-start", marginTop: 32 }}>
                                <label className="nativeAdsFieldLabel">Image / Video Preview :</label>
                                <div className="nativeAdsFieldInputWrapper" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, width: '100%' }}>
                                        <input
                                            type="text"
                                            value={fieldValue(imagevideoPreview)}
                                            onChange={e => setImagevideoPreview(e.target.value)}
                                            className="nativeAdsFieldInput"
                                            placeholder="Image / Video Preview"
                                            style={{ minWidth: 200 }}
                                        />
                                        <Customtooltip text="Copy Image/videoPreview URL" variant="copy">
                                            <TooltipcopyButton value={fieldValue(imagevideoPreview)} />
                                        </Customtooltip>
                                        <Customtooltip text="Open New Tab" variant="animated">
                                            <TooltipOpenNewTabButton url={imagevideoPreview} />
                                        </Customtooltip>

                                    </div>
                                    {(isImageUrl(imagevideoPreview) || isVideoUrl(imagevideoPreview)) ? (
                                        <>
                                            {isImageUrl(imagevideoPreview) && (
                                                <Image
                                                    src={imagevideoPreview}
                                                    alt="Preview"
                                                    style={{ maxHeight: 300, maxWidth: 400, marginBottom: 9 }}
                                                    onError={e => (e.target.style.display = 'none')}
                                                    height={700}
                                                    width={500}
                                                />
                                            )}
                                            {isVideoUrl(imagevideoPreview) && (
                                                <video
                                                    src={imagevideoPreview}
                                                    controls
                                                    style={{ maxHeight: 768, maxWidth: 432, marginBottom: 9 }}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        isSubmitted && <div className="">{fieldValue(imagevideoPreview)}</div>
                                    )}
                                    <div>
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
                        </div>
                    )}
                    {tab === 1 && (() => {
                        const thStyle = {
                            padding: "12px",
                            textAlign: "left",
                            fontWeight: "600",
                            backgroundColor: "#f3f4f6",
                            borderBottom: "1px solid #ccc",
                            color: "#111827",
                        };

                        const tdStyle = {
                            padding: "10px 12px",
                            verticalAlign: "top",
                            fontSize: "14px",
                            color: "#1e293b",
                        };

                        return (
                            <div style={{ overflowX: "auto" }}>
                                <table className="nativeAdsTable" style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead style={{ backgroundColor: "#f5f5f5" }}>
                                        <tr>
                                            <th style={thStyle}>S.No</th>
                                            <th style={thStyle}>Trackers / Pixel URLs</th>
                                            <th style={thStyle}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eventTrackers.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} style={{ textAlign: "center", padding: "12px" }}>
                                                    No Data
                                                </td>
                                            </tr>
                                        ) : (
                                            eventTrackers.map(({ sno, url }) => (
                                                <tr key={sno} style={{ borderBottom: "1px solid #eaeaea" }}>
                                                    <td style={tdStyle}>{sno || ""}</td>
                                                    <td style={{ ...tdStyle, wordBreak: "break-all", color: "#334155" }}>{url || "NA"}</td>
                                                    <td style={tdStyle}>
                                                        {url && url !== "NA" && (
                                                            <Customtooltip text="Open New Tab" variant="animated">
                                                                <TooltipOpenNewTabButton url={url} />
                                                            </Customtooltip>

                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}