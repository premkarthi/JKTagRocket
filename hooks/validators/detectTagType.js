// app/hooks/validators/detectTagType.js

/**
 * Detects the type of ad tag: "vast", "vpaid", or "unknown"
 * @param {string} tagInput - Raw ad tag (URL or XML string)
 * @returns {"vast" | "vpaid" | "unknown"}
 */
export function detectTagType(tagInput) {
  if (!tagInput || typeof tagInput !== "string") return "unknown";

  const lowerTag = tagInput.toLowerCase();

  if (lowerTag.includes("<vast")) return "vast";
  if (lowerTag.includes("vpaid") || lowerTag.includes("vpaidcreative")) return "vpaid";
  if (lowerTag.endsWith(".xml") || lowerTag.startsWith("http")) return "vast";

  return "unknown";
}
