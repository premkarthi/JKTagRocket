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
                        placeholder="  Paste your Vast/VPaid video ad tag here... !!!"
                        value={videoAdCode}
                        onChange={(e) => setVideoAdCode(e.target.value)}
                        className={styles.displayAdsTextarea}
                    />
                    <div className={styles.displayAdsButtonGroup}>
                        <button
                        className={styles.displayAdsResetBtn}
                        // onClick={reset}
                        >
                           ❌ Reset
                        </button>
                        <button
                            className={styles.displayAdsPreviewBtn}
                            onClick={handlePreview}
                            type="button"
                        >
                            XML Response
                        </button>
                        <button
                            className={styles.displayAdsPreviewBtn}
                            onClick={handlePreview}
                            type="button"
                        >
                           👁️ Generate Preview
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
                            : "Dynamic video preview load here..."}
                    </div>
                </div>
            </div>
            <Faq
                title="How do I preview of Vast/VPaid video tag ad?"
                list={[
                    "Paste your  Vast/VPaid video ad tag  in the left side box.",
                    "Click Generate Preview to see a live rendering video .",
                    "Review compatibility and performance instantly.",
                    "Ensure your video ads are compliant with industry standards.",
                    "View the VAST content (XML) by clicking the 'VAST XML Response' button.",
                ]}
            />
        </div>
    );
}