"use client";

import React, { useState } from "react";
import styles from "./DisplayAds.module.css";
import Faq from "../../../components/Faq";


export default function DisplayAds() {
    const [adCode, setAdCode] = useState("");
    const [preview, setPreview] = useState(null);
    const title = 'How do I preview an HTML5 ad?'
    const list = ['Preview an HTML5 ad by uploading an HTML5 zip file', 'View a live ad preview, images of each frame, and a video of the ad', 'View network timelines, load times, file sizes, and more to ensure ads are compliant', 'Share with clients and get feedback']

    const handleReset = () => {
        setAdCode("");
        setPreview(null);
    };

    const handlePreview = () => {
        setPreview(adCode);
    };

    return (
        <div className={styles.displayAdsContainer}>
            <div style={{ marginBottom: 24 }}>
                <h1 className={styles.displayAdsHeader}>Display Ads</h1>
                <div className={styles.displayAdsSubtitle}>
                    Paste you Google Display Ads tag to Preview
                </div>
            </div>

            <div className={styles.displayAdsInputCard}>
                <label
                    htmlFor="displayAdInput"
                    className={styles.displayAdsInputLabel}
                >
                    Paste your link
                </label>
                <textarea
                    id="displayAdInput"
                    rows={7}
                    placeholder="Paste your Google Display Ads tag here..."
                    value={adCode}
                    onChange={(e) => setAdCode(e.target.value)}
                    className={styles.displayAdsTextarea}
                />
                <div className={styles.displayAdsButtonGroup}>
                    <button
                        className={styles.displayAdsResetBtn}
                        onClick={handleReset}
                        type="button"
                    >
                        Reset
                    </button>
                    <button
                        className={styles.displayAdsPreviewBtn}
                        onClick={handlePreview}
                        type="button"
                    >
                        Generate Preview
                    </button>
                </div>
                {preview && (
                    <div className={styles.displayAdsPreviewArea}>
                        <div className={styles.displayAdsPreviewTitle}>Ad Preview</div>
                        <div
                            className={styles.displayAdsPreviewContent}
                            dangerouslySetInnerHTML={{ __html: preview }}
                        />
                    </div>
                )}
            </div>

            <Faq title={title} list={list} ></Faq>
        </div>
    );
}