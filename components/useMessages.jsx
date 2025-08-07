import { useState, useEffect } from "react";
import "../styles/Usemessages.css"; // Optional: ensure only one import globally

// Hook: for auto-dismissing user messages
export function useAutoDismissMessage(initialMessage = null, timeout = 7000) {
  const [message, setMessageState] = useState(initialMessage);
  const [isVisible, setIsVisible] = useState(false);

  const setSmartMessage = (msg) => {
    setMessageState(msg ? { ...msg } : null);
  };

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setMessageState(null), 300); // fade delay
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [message, timeout]);

  return [
    message && isVisible ? message : message ? { ...message, fading: true } : null,
    setSmartMessage
  ];
}

// Icon helper based on message type
export function getIcon(type) {
  switch (type) {
    case "success":
      return "✔️";
    case "error":
      return "❌";
    case "warning":
      return "⚠️";
    case "info":
    default:
      return "ℹ️";
  }
}

// Component: UserMessage renderer
export function UserMessage({ message, setMessage }) {
  if (!message) return null;

  const fadingOut = message.fading === true;

  return (
    <div className={`user-message ${message.type} ${fadingOut ? "fade-out" : ""}`}>
      <div className="user-message-icon">{getIcon(message.type)}</div>
      <div className="user-message-content">{message.text}</div>
      <div
        className="user-message-dismiss"
        onClick={() => setMessage(null)}
        title="Dismiss"
      >
        x Dismiss
      </div>
    </div>
  );
}
