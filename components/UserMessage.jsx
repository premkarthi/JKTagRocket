"use client";

import React from "react";
import { useGlobalMessage } from "@components/useGlobalMessage";
import "@styles/GlobalMessage.css"; // ← or whatever your CSS path is

export default function UserMessage() {
  const { messages } = useGlobalMessage();

  if (!messages.length) return null;

  return (
    <div className="user-message-wrapper">
      {messages.map((msg) => (
        <div key={msg.id} className={`user-message ${msg.type}`}>
          <span className="icon">{msg.icon}</span>
          <div className="message-content">
            {msg.title && <strong className="title">{msg.title}</strong>}
            <span className="text">{msg.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
