"use client";

import React, { useState } from "react";
import "../../../styles/Base64encodedecode.css";
import "../../../styles/Usemessages.css";
import { useAutoDismissMessage, UserMessage } from "../../useMessages";

export default function Base64Panel() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [message, setMessage] = useAutoDismissMessage(null, 5000);

  const encode = () => {
        if (!input.trim()) {
          setMessage({ type: "warning", text: " Please enter text or URL to Base64 encode." });
          return;
        }

        try {
          setResult(btoa(input));
          setMessage({ type: "success", text: " Successfully encoded Base64 input string..!" });
        } catch {
          setMessage({ type: "error", text: " Encoding failed, invalid Base64 input string..!" });
        }
      };

      const decode = () => {
        if (!input.trim()) {
          setMessage({ type: "warning", text: " Please enter text or URL to Base64 decode." });
          return;
        }

        try {
          setResult(atob(input));
          setMessage({ type: "success", text: " Successfully decoded Base64 input string..!" });
        } catch {
          setMessage({ type: "error", text: " Decoding failed, invalid Base64 input string..!" });
        }
      };


  const copy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setMessage({ type: "success", text: " Output Copied to clipboard successfully..!" });
    }else {
    setMessage({ type: "info", text: "Nothing to copy — output is empty..!" });
  }
  };

  const reset = () => {
    setInput("");
    setResult("");
    setMessage({ type: "info", text: " Input and output results successfully cleared..!" });
  };

  return (
    <div className="base64Panel">
       <div className="base64PanelTitle">
        <span className="base64PanelTitleIcon">
        <img src="/images/base64encodedecode.png" alt="Base64 Icon" width="33" height="33" />
      </span> Base64 Encode/Decode
      </div>

      <textarea
        className="base64-textarea"
        placeholder="Paste your Encoded/Decoded text here ..!"
        rows={7}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <textarea
        className="base64-result"
        placeholder="Encoded/Decoded output will appear here ..!"
        rows={7}
        value={result}
        readOnly
      />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
        <button className="base64-reset-btn" onClick={reset}>🔄 Reset</button>
        <button className="base64-encode-btn" onClick={encode}>⚙️ Encode</button>
        <button className="base64-decode-btn" onClick={decode}>⚙️ Decode</button>
        <button className="base64-copy-btn" onClick={copy}>📋 Copy</button>
        </div>

        <UserMessage message={message} setMessage={setMessage} />
    </div>
  );
}
