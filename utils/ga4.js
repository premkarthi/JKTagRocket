// utils/ga4.js
export const sendGAEvent = ({ action, category, label, value }) => {
  if (typeof window === "undefined") return;

  if (typeof window.gtag !== "function") {
    console.warn("❌ gtag is not defined yet. Skipping event:", action);
    return;
  }

  const params = {
    event_category: category,
    event_label: label,
    value,
  };

  console.log("📡 Sending GA4 event:", action, params);

  window.gtag("event", action, params);
};
