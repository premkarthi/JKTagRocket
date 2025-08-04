"use client";

import { useState, useCallback, useContext, createContext } from "react";
import { v4 as uuidv4 } from "uuid";
import UserMessage from "./UserMessage";

const GlobalMessageContext = createContext();

let globalAddMessage = () => {
  throw new Error("addMessage called before GlobalMessageProvider was initialized");
};

export function GlobalMessageProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback(({ title = "", text = "", type = "info" }) => {
  const newMessage = {
    id: uuidv4(),
    title,
    text,
    type,
    icon: getIcon(type),
    timestamp: Date.now(),
  };

  setMessages((prev) => {
    const existingOfSameType = prev.find((msg) => msg.type === type && msg.text === text);
    if (existingOfSameType) return prev;

    const priority = { error: 4, warning: 3, info: 2, success: 1 };
    const highestPriority = Math.max(...prev.map((msg) => priority[msg.type] || 0), priority[type]);

    if ((priority[type] || 0) < highestPriority) return prev;

    const filtered = prev.filter((msg) => (priority[msg.type] || 0) >= priority[type]);
    return [...filtered, newMessage];
  });

  setTimeout(() => {
    setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
  }, 11000);
}, []);

  // Assign to global function
  globalAddMessage = addMessage;

  return (
    <GlobalMessageContext.Provider value={{ messages, addMessage }}>
      {children}
    </GlobalMessageContext.Provider>
  );
}

export function useGlobalMessage() {
  return useContext(GlobalMessageContext);
}
export { addMessage, getIcon, UserMessage };
export function addMessage({ title = "", text = "", type = "info" }) {
  globalAddMessage({ title, text, type });
}


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
