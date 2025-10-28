"use client";

import React, { useState } from "react";
import "../../../styles/Urlencodedecode.css";
import "../../../styles/Usemessages.css";
import { InlineUserMessage, useLocalMessage } from "../../useMessages";

export default function UrlEncodePanel() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [message, setMessage] = useLocalMessage(5000); // per-panel messages

  const encode = () => {
    if (!input.trim()) {
      setMessage({ type: "warning", text: "Please enter some text or URL to encode." });
      return;
    }
    try {
      setResult(encodeURIComponent(input));
      setMessage({ type: "success", text: "URL successfully encoded." });
    } catch (e) {
      setMessage({ type: "error", text: "Encoding failed." });
    }
  };

  const decode = () => {
    if (!input.trim()) {
      setMessage({ type: "warning", text: "Please enter an encoded URL or string to decode." });
      return;
    }
    try {
      setResult(decodeURIComponent(input));
      setMessage({ type: "success", text: "URL successfully decoded." });
    } catch (e) {
      setMessage({ type: "error", text: "Decoding failed. Invalid input." });
    }
  };

  const copy = () => {
    if (result.trim()) {
      navigator.clipboard.writeText(result);
      setMessage({ type: "success", text: "Output copied to clipboard successfully!" });
    } else {
      setMessage({ type: "info", text: "Nothing to copy — output is empty." });
    }
  };

  const reset = () => {
    setInput("");
    setResult("");
    setMessage({ type: "info", text: "Input and output cleared!" });
  };

  return (
    <div className="urlPanel">
      <div className="urlPanelTitle">
        <span className="urlPanelTitleIcon">🔀</span> URL Encode/Decode
      </div>

      <textarea
        className="url-textarea"
        placeholder="Paste your Encoded/Decoded URL here..."
        rows={7}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <textarea
        className="url-result"
        placeholder="Encoded/Decoded output will appear here..."
        rows={7}
        value={result}
        readOnly
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          marginTop: "16px",
          flexWrap: "wrap",
        }}
      >
        <button className="url-reset-btn" onClick={reset}>
          🔄 Reset
        </button>
        <button className="url-encode-btn" onClick={encode}>
          ⚙️ Encode
        </button>
        <button className="url-decode-btn" onClick={decode}>
          ⚙️ Decode
        </button>
        <button className="url-copy-btn" onClick={copy}>
          📋 Copy
        </button>
      </div>

      <InlineUserMessage message={message} setMessage={setMessage} />
    </div>
  );
}
