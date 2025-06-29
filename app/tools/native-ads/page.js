"use client";

import React, { useState } from "react";
import styles from "../display-ads/DisplayAds.module.css";
import "./NativeAdsAddon.css"; // Import your custom addons

const TABS = [
    { label: "Native Ad Information" },
    { label: "Trackers" },
    { label: "Pixel's" },
];

export default function NativeAds() {
    const [nativeTag, setNativeTag] = useState("");
    const [tab, setTab] = useState(0);

    // Native Ad Information fields
    const [nativeSsp, setNativeSsp] = useState("");
    const [headline, setHeadline] = useState("");
    const [description, setDescription] = useState("");
    const [brandName, setBrandName] = useState("");

    const handleReset = () => {
        setNativeTag("");
        setNativeSsp("");
        setHeadline("");
        setDescription("");
        setBrandName("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // submit logic here
    };

    const copyToClipboard = (value) => {
        navigator.clipboard.writeText(value);
    };

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
                    placeholder="Paste your Native tag !!!"
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
                            <div className="nativeAdsFieldRow">
                                <label className="nativeAdsFieldLabel">
                                    Native SSP
                                </label>
                                <div className="nativeAdsFieldInputWrapper">
                                    <input
                                        type="text"
                                        value={nativeSsp}
                                        onChange={e => setNativeSsp(e.target.value)}
                                        className="nativeAdsFieldInput"
                                    />
                                    <button
                                        type="button"
                                        className="nativeAdsCopyBtn"
                                        onClick={() => copyToClipboard(nativeSsp)}
                                    >
                                        <span role="img" aria-label="Copy">📋</span>
                                    </button>
                                </div>
                            </div>
                            <div className="nativeAdsFieldRow">
                                <label className="nativeAdsFieldLabel">
                                    Headline ( Title )
                                </label>
                                <div className="nativeAdsFieldInputWrapper">
                                    <input
                                        type="text"
                                        value={headline}
                                        onChange={e => setHeadline(e.target.value)}
                                        className="nativeAdsFieldInput"
                                    />
                                    <button
                                        type="button"
                                        className="nativeAdsCopyBtn"
                                        onClick={() => copyToClipboard(headline)}
                                    >
                                        <span role="img" aria-label="Copy">📋</span>
                                    </button>
                                </div>
                            </div>
                            <div className="nativeAdsFieldRow">
                                <label className="nativeAdsFieldLabel">
                                    Sub Headline / Description
                                </label>
                                <div className="nativeAdsFieldInputWrapper">
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="nativeAdsFieldInput"
                                        rows={2}
                                    />
                                    <button
                                        type="button"
                                        className="nativeAdsCopyBtn"
                                        onClick={() => copyToClipboard(description)}
                                    >
                                        <span role="img" aria-label="Copy">📋</span>
                                    </button>
                                </div>
                            </div>
                            <div className="nativeAdsFieldRow">
                                <label className="nativeAdsFieldLabel">
                                    Brand Name
                                </label>
                                <div className="nativeAdsFieldInputWrapper">
                                    <input
                                        type="text"
                                        value={brandName}
                                        onChange={e => setBrandName(e.target.value)}
                                        className="nativeAdsFieldInput"
                                    />
                                    <button
                                        type="button"
                                        className="nativeAdsCopyBtn"
                                        onClick={() => copyToClipboard(brandName)}
                                    >
                                        <span role="img" aria-label="Copy">📋</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Tab 1: Trackers */}
                    {tab === 1 && (
                        <div className="nativeAdsTabPlaceholder">
                            Trackers tab content here.
                        </div>
                    )}
                    {/* Tab 2: Pixel's */}
                    {tab === 2 && (
                        <div className="nativeAdsTabPlaceholder">
                            Pixels tab content here.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}