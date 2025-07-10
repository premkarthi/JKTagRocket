"use client";
import React, { useState } from "react";
import styles from "../../../app/tools/display-ads/DisplayAds.module.css";
import "../../../styles/globals.css"; // This should include the .user-message styles

export default function UrlEncodePanel() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [message, setMessage] = useState(null); // { type: 'success' | 'error' | 'info', text: '' }

    const encode = () => {
    if (!input.trim()) {
        setMessage({ type: "warning", text: "⚠️ Please enter some text or URL to encode." });
        return;
    }
    try {
        setResult(encodeURIComponent(input));
        setMessage({ type: "info", text: "✅ URL successfully encoded." });
    } catch (e) {
        setMessage({ type: "error", text: "Encoding failed." });
    }
    };

    const decode = () => {
        if (!input.trim()) {
            setMessage({ type: "warning", text: "⚠️ Please enter an encoded URL or string to decode." });
            return;
        }
        try {
            setResult(decodeURIComponent(input));
            setMessage({ type: "info", text: "✅ URL successfully decoded." });
        } catch (e) {
            setMessage({ type: "error", text: "Decoding failed. Invalid input." });
        }
    };


    const copy = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            setMessage({ type: "success", text: "📋 Result copied to clipboard!" });
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
                    🔗
                </span>
                URL Encode &amp; Decode
            </div>

            <label className="dataBeautifyLabel">Enter URL or Text</label>
            <textarea
                className="dataBeautifyTextarea"
                placeholder="Paste your URL here..."
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
                        <a
                            href="#"
                            className="user-message-action"
                            onClick={(e) => {
                                e.preventDefault();
                                setMessage(null);
                            }}
                        >
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
                    Encode URL
                </button>
                <button
                    className={styles.displayAdsPreviewBtn}
                    type="button"
                    onClick={decode}
                >
                    Decode URL
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
// This code defines a React component for URL encoding and decoding.
// It includes a text area for input, a button to encode the URL, and a button to decode it.
// The results are displayed in a read-only text area, and there are buttons to copy the result and reset the input.
// The component also handles messages for success, error, and info states, displaying them in a styled message box.
// The `getIcon` function returns the appropriate icon based on the message type.
// The component uses CSS classes for styling, which should be defined in the `globals.css` file or a similar stylesheet.
// The `dataBeautifyPanel`, `dataBeaut