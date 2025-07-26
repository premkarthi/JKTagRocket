// import { useState, useEffect } from "react";
// import "../styles/Usemessages.css"; // Import styles ONCE here

// components/useMessages.js
import { useState, useEffect } from "react";

export function useAutoDismissMessage(initialMessage = null, timeout = 5000) {
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

  // include visibility in return
  return [message && isVisible ? message : message ? { ...message, fading: true } : null, setSmartMessage];
}


export function getIcon(type) {
  switch (type) {
    case "success": return "✔️";
    case "error": return "❌";
    case "warning": return "⚠️";
    case "info": default: return "ℹ️";
  }
}

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
