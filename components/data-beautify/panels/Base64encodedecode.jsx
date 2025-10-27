"use client";

import React, { useState } from "react";
import "../../../styles/Base64encodedecode.css";
import "../../../styles/Usemessages.css";
import { InlineUserMessage, useLocalMessage } from "@components/useMessages";

export default function Base64Panel() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [message, setMessage] = useLocalMessage(5000); // per-panel messages

  const encode = () => {
    if (!input.trim()) {
      setMessage({ type: "warning", text: "Please enter text to Base64 encode." });
      return;
    }
    try {
      setResult(btoa(input));
      setMessage({ type: "success", text: "Successfully encoded to Base64." });
    } catch (e) {
      setMessage({ type: "error", text: "Encoding failed." });
    }
  };

  const decode = () => {
    if (!input.trim()) {
      setMessage({ type: "warning", text: "Please enter Base64 text to decode." });
      return;
    }
    try {
      setResult(atob(input));
      setMessage({ type: "success", text: "Successfully decoded from Base64." });
    } catch (e) {
      setMessage({ type: "error", text: "Decoding failed. Invalid Base64 string." });
    }
  };

  const copy = () => {
    if (result.trim()) {
      navigator.clipboard.writeText(result);
      setMessage({ type: "success", text: "Output copied to clipboard!" });
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
    <div className="base64Panel">
      <div className="base64PanelTitle">
        <span className="base64PanelTitleIcon">🅱️</span> Base64 Encode/Decode
      </div>

      <textarea
        className="base64-textarea"
        placeholder="Paste your text here..."
        rows={7}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <textarea
        className="base64-result"
        placeholder="Result will appear here..."
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
        <button className="base64-reset-btn" onClick={reset}>
          🔄 Reset
        </button>
        <button className="base64-encode-btn" onClick={encode}>
          ⚙️ Encode
        </button>
        <button className="base64-decode-btn" onClick={decode}>
          ⚙️ Decode
        </button>
        <button className="base64-copy-btn" onClick={copy}>
          📋 Copy
        </button>
      </div>

      <InlineUserMessage message={message} setMessage={setMessage} />
    </div>
  );
}
