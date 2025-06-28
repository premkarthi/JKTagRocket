"use client";

import React, { useState } from "react";
import styles from "../display-ads/DisplayAds.module.css";
import Faq from "../../../components/Faq";

export default function VideoValidator() {
    const [videoAdCode, setVideoAdCode] = useState("");
    const [preview, setPreview] = useState("");

    const handlePreview = () => {
        setPreview(videoAdCode);
    };

    return (
        <div className={styles.displayAdsContainer}>
            <div style={{ marginBottom: 24 }}>
                <h1 className={styles.displayAdsHeader}>Video Validator</h1>
                <div className={styles.displayAdsSubtitle}>
                    Test video ad tags with comprehensive performance analytics
                </div>
            </div>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                {/* Video Ad Code Input Card */}
                <div className={styles.displayAdsInputCard} style={{ flex: 1, minWidth: 350 }}>
                    <label
                        htmlFor="videoAdInput"
                        className={styles.displayAdsInputLabel}
                    >
                        Video Ad Code
                    </label>
                    <textarea
                        id="videoAdInput"
                        rows={7}
                        placeholder="Paste your video ad HTML or video tag here..."
                        value={videoAdCode}
                        onChange={(e) => setVideoAdCode(e.target.value)}
                        className={styles.displayAdsTextarea}
                    />
                    <div className={styles.displayAdsButtonGroup}>
                        <button
                            className={styles.displayAdsPreviewBtn}
                            onClick={handlePreview}
                            type="button"
                        >
                            Generate Preview
                        </button>
                    </div>
                </div>
                {/* Video Preview Card */}
                <div className={styles.displayAdsInputCard} style={{ flex: 1, minWidth: 350 }}>
                    <label className={styles.displayAdsInputLabel}>
                        Video Preview
                    </label>
                    <div
                        className={styles.displayAdsPreviewContent}
                        style={{
                            minHeight: 160,
                            color: "#b3b3cb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {preview
                            ? <div dangerouslySetInnerHTML={{ __html: preview }} />
                            : "Enter video code to see preview"}
                    </div>
                </div>
            </div>
            <Faq
                title="How do I preview a video ad?"
                list={[
                    "Paste your video ad tag or HTML in the left box.",
                    "Click Generate Preview to see a live rendering.",
                    "Review compatibility and performance instantly.",
                ]}
            />
        </div>
    );
}