
"use client";
import { FiUpload } from "react-icons/fi";
import React, { useRef, useState } from "react";
import styles from "../display-ads/DisplayAds.module.css";
import Faq from "../../../components/Faq";

export default function HTML5ValidatorPage() {
    const inputRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const title = 'How do I preview an HTML5 ad?'
    const list = ['Preview an HTML5 ad by uploading an zip file.', 
                  'The format of zip files  supported creative masters could be GWD, AnimateCC, and HTML5.',
                  'View a live ad preview, images of each frame, and a video of the ad.', 
                  'View network timelines, load times, file sizes, and more to ensure ads are compliant,with Deep capture check box is ON.' ]
                  

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
                <label
                    htmlFor="displayAdInput"
                    className={styles.displayAdsInputLabel}
                >
                    File Upload
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