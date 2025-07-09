import React, { useState } from "react";
import styles from "../../../app/tools/display-ads/DisplayAds.module.css";


export default function Base64Panel() {
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [result, setResult] = useState("");

    const encode = () => {
        setError("");
        try {
            setResult(btoa(input));
        } catch (e) {
            setError("Encoding failed.");
        }
    };
    const decode = () => {
        setError("");
        try {
            setResult(atob(input));
        } catch (e) {
            setError("Decoding failed.");
        }
    };
    const copy = () => {
        if (result) navigator.clipboard.writeText(result);
    };
    const reset = () => {
        setInput("");
        setResult("");
        setError("");
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
                onChange={e => setInput(e.target.value)}
            />
            {result && (
                <div className="dataBeautifyPanelResult" style={{ marginTop: 10, color: "#2e2e2e", background: "#f6f6ff", padding: 10, borderRadius: 8 }}>
                    {result}
                </div>
            )}
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
            <div className="dataBeautifyPanelActions">
                <button className={styles.displayAdsPreviewBtn} type="button" onClick={encode}>Encode</button>
                <button className={styles.displayAdsPreviewBtn} type="button" onClick={decode}>Decode</button>
                <button className={styles.displayAdsResetBtn} type="button" title="Copy" onClick={copy}>
                    <span role="img" aria-label="Copy">📋</span>
                </button>
                <button className={styles.displayAdsResetBtn} type="button" title="Reset" onClick={reset}>
                    <span role="img" aria-label="Reset">🔄</span>
                </button>
            </div>
        </div>
    );
}