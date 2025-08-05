// hooks/validators/useVASTParser.js

export function useVASTParser() {
  const parseVAST = async (tagUrl) => {
    try {
      const response = await fetch(tagUrl);
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "application/xml");

      // MediaFile
      const mediaFileTag = xml.querySelector("MediaFile");
      const mediaUrl = mediaFileTag?.textContent?.trim();

      // Events
      const trackingTags = Array.from(xml.querySelectorAll("Tracking"));
      const events = trackingTags.map((tag) => ({
        event: tag.getAttribute("event"),
        url: tag.textContent.trim(),
      }));

      // Impressions
      const impressionTags = Array.from(xml.querySelectorAll("Impression"));
      const impressions = impressionTags.map((tag) => tag.textContent.trim());

      return {
        mediaFile: mediaUrl, // ✅ now a string
        trackers: [
          ...events,
          ...impressions.map((url) => ({ event: "impression", url })),
        ],
      };
    } catch (error) {
      console.error("VAST parsing failed:", error);
      return null;
    }
  };

  return { parseVAST };
}
