// components/UserIdTracker.js
"use client";
import { useEffect } from "react";

export default function UserIdTracker() {
  useEffect(() => {
    const key = "tagrocket_user_id";
    let userId = localStorage.getItem(key);

    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem(key, userId);
      console.log("✅ Generated new user_id:", userId);
    } else {
      console.log("✅ Existing user_id:", userId);
    }

    // ✅ Send to GA4 after a short delay to ensure gtag is ready
    const interval = setInterval(() => {
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag("config", "G-XXXXXXX", {
          user_id: userId,
        });
        console.log("📡 GA4 user_id sent:", userId);
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return null;
}
