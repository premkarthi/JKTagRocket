"use client";

import { addMessage } from "@components/useGlobalMessage";

export function useXMLFetcher() {
  const fetchXML = async (url) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/xml",
        },
      });

      if (!response.ok) {
        addMessage({
          title: "XML Fetcher",
          text: `Failed to fetch: ${response.status}`,
          type: "error",
        });
        return null;
      }

      const text = await response.text();

      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");

      const parserError = xml.getElementsByTagName("parsererror");
      if (parserError.length > 0) {
        addMessage({
          title: "XML Fetcher",
          text: "Malformed XML returned by server.",
          type: "error",
        });
        return null;
      }

      return xml;
    } catch (err) {
      addMessage({
        title: "XML Fetcher",
        text: `Error fetching XML: ${err.message}`,
        type: "error",
      });
      return null;
    }
  };

  return { fetchXML };
}
