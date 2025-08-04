"use client";

import React from "react";
import { useGlobalMessage } from "./useGlobalMessage";
import "@styles/GlobalMessage.css"; // make sure this is imported

export default function GlobalMessage() {
  const { messages } = useGlobalMessage();

  return (
    <div className="global-message-container">
      {messages.map((msg) => {
        const { id, icon, type } = msg;
        let content;

        if (typeof msg.text === "object" && msg.text !== null) {
          // Handle structured message with title and text
          const { title, text } = msg.text;
          content = (
            <div className="user-message-content">
              <div className="user-message-title">{title}</div>
              <div className="user-message-text">{text}</div>
            </div>
          );
        } else {
          // Fallback for string messages
          content = <div className="user-message-content">{msg.text}</div>;
        }

        return (
          <div key={id} className={`user-message ${type}`}>
            <span className="user-message-icon">{icon}</span>
            {content}
          </div>
        );
      })}
    </div>
  );
}
