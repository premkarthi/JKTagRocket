import { useState, useEffect } from "react";

/**
 * useAutoDismissMessage - A hook to manage user messages with auto-dismiss.
 * @param {Object|null} initialMessage - Initial message { type, text }
 * @param {number} timeout - Duration before auto-dismiss in ms
 * @returns [message, setMessage]
 */
export function useAutoDismissMessage(initialMessage = null, timeout = 5000) {
    const [message, setMessage] = useState(initialMessage);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(() => setMessage(null), 300); // wait for fade-out
            }, timeout);
            return () => clearTimeout(timer);
        }
    }, [message, timeout]);

    return [visible ? message : null, setMessage];
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
