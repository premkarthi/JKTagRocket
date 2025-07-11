import { useState, useEffect } from "react";

/**
 * useAutoDismissMessage - A hook to manage user messages with auto-dismiss.
 * @param {Object|null} initialMessage - Initial message { type, text }
 * @param {number} timeout - Duration before auto-dismiss in ms
 * @returns [message, setMessage]
 */
export function useAutoDismissMessage(initialMessage = null, timeout = 5500) {
    const [message, setMessage] = useState(initialMessage);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), timeout);
            return () => clearTimeout(timer);
        }
    }, [message, timeout]);

    return [message, setMessage];
}

/**
 * getIcon - Returns an emoji icon based on message type
 * @param {"success"|"error"|"warning"|"info"} type
 * @returns Emoji icon string
 */
export function getIcon(type) {
    switch (type) {
        case "success": return "✔️";
        case "error": return "❌";
        case "warning": return "⚠️";
        case "info":
        default: return "ℹ️";
    }
}
