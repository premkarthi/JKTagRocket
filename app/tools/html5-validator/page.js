"use client";
import { FiUpload } from "react-icons/fi";
import React, { useRef, useState, useEffect } from "react";
import styles from "../display-ads/DisplayAds.module.css";
import Faq from "../../../components/Faq";
import JSZip from "jszip";

export default function HTML5ValidatorPage() {
    const inputRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [iframeUrl, setIframeUrl] = useState(null);
    const title = 'How do I preview an HTML5 ad?';
    const list = [
        'Preview an HTML5 ad by uploading a zip file.',
        'Supported formats: GWD, AnimateCC, and HTML5 creatives.',
        'View live ad preview, frame images, and ad video.',
        'Analyze network timeline, load time, size, and compliance with Deep Capture enabled.'
    ];

    useEffect(() => {
        return () => {
            if (iframeUrl) {
                URL.revokeObjectURL(iframeUrl);
            }
        };
    }, [iframeUrl]);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsActive(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) handleFileChange({ target: { files } });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsActive(true);
    };

    const handleDragLeave = () => {
        setIsActive(false);
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.name.endsWith(".zip")) {
            alert("Please upload a ZIP file");
            return;
        }

        const zip = await JSZip.loadAsync(file);
        let indexFile = null;

        // Look for index.html or any .html file
        zip.forEach((relativePath, zipEntry) => {
            if (!indexFile && zipEntry.name.toLowerCase().includes("index.html")) {
                indexFile = zipEntry;
            }
        });

        if (!indexFile) {
            const htmlFiles = Object.values(zip.files).filter(f => f.name.endsWith(".html"));
            if (htmlFiles.length > 0) {
                indexFile = htmlFiles[0];
            } else {
                alert("No HTML file found in the ZIP.");
                return;
            }
        }

        const fileMap = new Map();
        for (const path in zip.files) {
            const entry = zip.files[path];
            if (!entry.dir) {
                const blob = await entry.async("blob");
                const blobURL = URL.createObjectURL(blob);
                fileMap.set(path, blobURL);
            }
        }

        // Load and rewrite the HTML file
        const htmlContent = await indexFile.async("text");
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");

        ["img", "script", "link"].forEach(tag => {
            const attr = tag === "link" ? "href" : "src";
            doc.querySelectorAll(`${tag}[${attr}]`).forEach(el => {
                const src = el.getAttribute(attr);
                if (!src) return;
                const normalizedPath = Object.keys(zip.files).find(p => p.endsWith(src) || p.includes(src));
                if (normalizedPath && fileMap.has(normalizedPath)) {
                    el.setAttribute(attr, fileMap.get(normalizedPath));
                }
            });
        });

        const blob = new Blob([doc.documentElement.outerHTML], { type: "text/html" });
        const previewUrl = URL.createObjectURL(blob);
        setIframeUrl(previewUrl);
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
                <label
                    htmlFor="displayAdInput"
                    className={styles.displayAdsInputLabel}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                    Zip file upload requirements :
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
                            accept=".zip"
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
                        onClick={() => setIframeUrl(null)}
                    >
                        Reset
                    </button>
                    <button
                        className={styles.displayAdsPreviewBtn}
                        type="button"
                        disabled
                    >
                        Submit
                    </button>
                </div>

                {iframeUrl && (
                    <div style={{ marginTop: 24 }}>
                        <h3>Live Preview</h3>
                        <iframe
                            src={iframeUrl}
                            title="HTML5 Preview"
                            style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
                        />
                    </div>
                )}
            </div>

            <Faq title={title} list={list} />
        </div>
    );
}
