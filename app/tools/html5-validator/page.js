
"use client";
import { FiUpload } from "react-icons/fi";
import React, { useRef, useState } from "react";
import styles from "../display-ads/DisplayAds.module.css";
import Faq from "../../../components/Faq";
import JSZip from "jszip";

export default function HTML5ValidatorPage() {
    const inputRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const title = 'How do I preview an HTML5 ad?'
    const list = ['Preview an HTML5 ad by uploading an zip file.',
        'The format of zip files  supported creative masters could be GWD, AnimateCC, and HTML5.',
        'View a live ad preview, images of each frame, and a video of the ad.',
        'View network timelines, load times, file sizes, and more to ensure ads are compliant,with Deep capture check box is ON.']


    const handleDrop = (e) => {
        e.preventDefault();
        setIsActive(false);
        // handle files: e.dataTransfer.files
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsActive(true);
    };

    const handleDragLeave = (e) => {
        setIsActive(false);
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (e) => {
        // handle file: e.target.files
    };
    return (
        <div className={styles.displayAdsContainer}>
            <div style={{ marginBottom: 24 }}>
                <h1 className={styles.displayAdsHeader}>HTML5 Validator</h1>
                <div className={styles.displayAdsSubtitle}>
                    <b>Instant HTML5 Validation — Built for Developers..</b>
                </div>
            </div>

            <div className={styles.displayAdsInputCard}>
                {/* <label
                    htmlFor="displayAdInput"
                    className={styles.displayAdsInputLabel}
                >
                    File Upload
                </label> */}
                <label
                    htmlFor="displayAdInput"
                    className={styles.displayAdsInputLabel}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                    Zip file upload requirements :
                    <span title="Upload Requirements">
                    </span>
                    <span style={{ position: "relative", cursor: "pointer" }}>
                        <span
                            style={{
                                display: "inline-block",
                                backgroundColor: "#e5e7eb",
                                color: "#333",
                                borderRadius: "50%",
                                width: "18px",
                                height: "18px",
                                fontSize: "12px",
                                lineHeight: "18px",
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                            title="Upload Requirements"
                        >
                            i
                        </span>

                        <div
                            style={{
                                position: "absolute",
                                top: "22px",
                                left: "-180px",
                                width: "360px",
                                backgroundColor: "#fff",
                                color: "#111827",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                fontSize: "13px",
                                padding: "12px",
                                zIndex: 10,
                                whiteSpace: "normal",
                                display: "none"
                            }}
                            className="TooltipCopyButton"
                        >
                            <strong>Upload Requirements</strong><br /><br />
                            <ul style={{ paddingLeft: "18px", margin: 0 }}>
                                <li>Google Web Designer (GWD)</li>
                                <li>Adobe Animate (AnimateCC)</li>
                                <li>Standard HTML5 creatives</li>
                            </ul>
                            <br />
                            ⚠️ Your ZIP must include at least one <code>.html</code> file (e.g., <code>index.html</code>, <code>creative.html</code>).<br />
                            📦 Ensure all referenced assets (images, CSS, JS) are packaged inside the ZIP.
                        </div>
                    </span>
                </label>

                <div
                    className={`${styles.dropzone} ${isActive ? styles.dropzoneActive : ""}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    tabIndex={0}
                    onClick={handleClick}
                >
                    <div className={styles.dropzoneInner}>
                        <FiUpload className={styles.dropzoneIcon} />
                        <div className={styles.dropzoneMainText}>
                            Drag &amp; Drop your Zip files here
                        </div>
                        <div className={styles.dropzoneBrowseText}>
                            Or
                        </div>
                        <button
                            className={styles.dropzoneButton}
                            type="button"
                            tabIndex={-1}
                        >
                            Browse and Upload
                        </button>
                        <input
                            type="file"
                            accept=".html,.zip"
                            style={{ display: "none" }}
                            ref={inputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <div className={styles.displayAdsButtonGroup}>
                    <button
                        className={styles.displayAdsResetBtn}
                        type="button"
                    >
                        Reset
                    </button>
                    <button
                        className={styles.displayAdsPreviewBtn}
                        type="button"
                    >
                        Submit
                    </button>
                </div>
            </div>

            <Faq title={title} list={list} ></Faq>
        </div>
    );
}