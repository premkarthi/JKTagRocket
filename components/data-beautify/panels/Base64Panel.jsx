"use client";
import React, { useState } from "react";
import styles from "../../../app/tools/display-ads/DisplayAds.module.css"; // adjust if needed
import "../../../styles/globals.css"; // contains your .user-message styles

export default function Base64Panel() {
    const [input, setInput] = useState("");
    const [message, setMessage] = useState(null); // { type: "info" | "error", text: "" }
    const [result, setResult] = useState("");

    const encode = () => {
        setMessage(null);
        try {
            setResult(btoa(input));
            setMessage({ type: "info", text: "✅ Successfully encoded!" });
        } catch (e) {
            setMessage({ type: "error", text: "Encoding failed." });
        }
    };

    const decode = () => {
        setMessage(null);
        try {
            setResult(atob(input));
            setMessage({ type: "info", text: "✅ Successfully decoded!" });
        } catch (e) {
            setMessage({ type: "error", text: "Decoding failed. Invalid Base64 string." });
        }
    };

    const copy = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            setMessage({ type: "success", text: "📋 Copied to clipboard!" });
        }
    };

    const reset = () => {
        setInput("");
        setResult("");
        setMessage(null);
    };

    const getIcon = (type) => {
        switch (type) {
            case "success":
                return "✔";
            case "error":
                return "✖";
            case "warning":
                return "❗";
            case "info":
            default:
                return "ℹ";
        }
    };

    return (
        <div className="dataBeautifyPanel">
            <div className="dataBeautifyPanelTitle">
                <span className="dataBeautifyPanelTitleIcon" style={{ marginRight: 4 }}>
                    🟰
                </span>
                Base64 Encode &amp; Decode
            </div>

            <label className="dataBeautifyLabel">Enter Text</label>
            <textarea
                className="dataBeautifyTextarea"
                placeholder="Paste your text here..."
                rows={7}
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <label className="dataBeautifyLabel">Output results will show here...</label>
            {result && (
                <textarea
                    className="dataBeautifyPanelResult"
                    placeholder="Output results will show here..."
                    rows={7}
                    value={result}
                    readOnly
                />
            )}

            {message && (
                <div
                    className={`user-message ${message.type}`}
                    style={{ whiteSpace: "pre-wrap", marginTop: 16 }}
                >
                    <div className="user-message-icon">{getIcon(message.type)}</div>
                    <div className="user-message-content">
                        <span>{message.text}</span>
                        <a href="#" className="user-message-action" onClick={(e) => {
                            e.preventDefault();
                            setMessage(null);
                        }}>
                            Dismiss
                        </a>
                    </div>
                </div>
            )}

            <div className="dataBeautifyPanelActions">
                <button
                    className={styles.displayAdsPreviewBtn}
                    type="button"
                    onClick={encode}
                >
                    ⚙️ Encode
                </button>
                <button
                    className={styles.displayAdsPreviewBtn}
                    type="button"
                    onClick={decode}
                >
                    ⚙️ Decode
                </button>
                <button
                    className={styles.displayAdsResetBtn}
                    type="button"
                    title="Copy"
                    onClick={copy}
                >
                    📋 Copy
                </button>
                <button
                    className={styles.displayAdsResetBtn}
                    type="button"
                    title="Reset"
                    onClick={reset}
                >
                    🔄 Reset
                </button>
            </div>
        </div>
    );
}
