// @components/useMessages.jsx
"use client";

import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import "@styles/Usemessages.css";

/* ---------------- Global Contexts ---------------- */
const GlobalMessageContext = createContext(null);
const GlobalMessagesStateContext = createContext(null);

/* ---------------- Global Provider ---------------- */
export function GlobalMessageProvider({ children }) {
  const { messages, addMessage, removeMessage } = useAutoDismissMessageQueue(7000);

  return (
    <GlobalMessageContext.Provider value={addMessage}>
      <GlobalMessagesStateContext.Provider value={{ messages, removeMessage }}>
        {children}
      </GlobalMessagesStateContext.Provider>
    </GlobalMessageContext.Provider>
  );
}

/* ---------------- Global Hooks ---------------- */
export function useGlobalMessage() {
  return useContext(GlobalMessageContext);
}

/* ---------------- Queue logic ---------------- */
export function useAutoDismissMessageQueue(defaultTimeout = 7000) {
  const [messages, setMessages] = useState([]);
  const timersRef = useRef({});

  const clearAll = () => {
    Object.values(timersRef.current).forEach(clearTimeout);
    timersRef.current = {};
    setMessages([]);
  };

  const addMessage = (msg, options = {}) => {
    const { replace = true, timeoutOverride } = options;

    if (replace) clearAll();

    const id = Date.now() + Math.random();
    const message = { id, ...msg };
    setMessages((prev) => [...prev, message]);

    const t = setTimeout(
      () => removeMessage(id),
      typeof timeoutOverride === "number" ? timeoutOverride : defaultTimeout
    );
    timersRef.current[id] = t;
  };

  const removeMessage = (id) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  useEffect(() => () => Object.values(timersRef.current).forEach(clearTimeout), []);

  return { messages, addMessage, removeMessage, clearAll };
}

/* ---------------- Icon Helper ---------------- */
export function getIcon(type) {
  switch (type) {
    case "success":
      return "✔️";
    case "error":
      return "❌";
    case "warning":
      return "⚠️";
    default:
      return "ℹ️";
  }
}

/* ---------------- Inline Message Component ---------------- */
export function InlineUserMessage({ message, setMessage, autoDismiss = 5000 }) {
  useEffect(() => {
    if (message && autoDismiss) {
      const t = setTimeout(() => setMessage(null), autoDismiss);
      return () => clearTimeout(t);
    }
  }, [message, autoDismiss, setMessage]);

  if (!message || !message.text) return null;

  return (
    <div className="user-message-inline-container">
      <div className={`user-message ${message.type}`}>
        <span className="icon">{getIcon(message.type)}</span>
        <div className="message-content">
          {message.title && <strong className="title">{message.title}</strong>}
          <span className="text">{message.text}</span>
        </div>
        {setMessage && (
          <button className="dismiss-btn" onClick={() => setMessage(null)}>
            X
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Global Inline Component ---------------- */
export function UserMessage() {
  const { messages, removeMessage } = useContext(GlobalMessagesStateContext) || {
    messages: [],
    removeMessage: () => {},
  };
  if (!messages.length) return null;

  return (
    <div className="user-message-wrapper">
      {messages.map((msg) => (
        <div key={msg.id} className={`user-message ${msg.type}`}>
          <span className="icon">{getIcon(msg.type)}</span>
          <div className="message-content">
            {msg.title && <strong className="title">{msg.title}</strong>}
            <span className="text">{msg.text}</span>
          </div>
          <button className="dismiss-btn" onClick={() => removeMessage(msg.id)}>
            X
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Local Message Hook ---------------- */
export function useLocalMessage(defaultTimeout = 5000) {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), defaultTimeout);
      return () => clearTimeout(t);
    }
  }, [message, defaultTimeout]);

  return [message, setMessage];
}
/* ---------------- Auto Dismiss Hook ---------------- */
export function useAutoDismissMessage(initialMessage = null, timeout = 5000) {
  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), timeout);
    return () => clearTimeout(t);
  }, [message, timeout]);

  return [message, setMessage];
}

