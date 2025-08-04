"use client";

import { addMessage } from "@components/useGlobalMessage";

// This version assumes the creative is JS-based and loaded into an iframe.
export function useVPAIDParser() {
  const parseVPAID = async (tag, videoRef, setEvents, setTrackers) => {
    try {
      // Create a hidden iframe and inject the VPAID creative
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(tag);
      doc.close();

      const script = doc.querySelector("script");
      if (!script) {
        addMessage({
          title: "VPAID Parser",
          text: "No <script> tag found in the VPAID tag.",
          type: "error",
        });
        document.body.removeChild(iframe);
        return { success: false };
      }

      // Allow some time for the script to execute
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const creative = iframe.contentWindow.VPAIDCreative;
      if (!creative || typeof creative.initAd !== "function") {
        addMessage({
          title: "VPAID Parser",
          text: "VPAID creative did not expose an initAd() method.",
          type: "error",
        });
        document.body.removeChild(iframe);
        return { success: false };
      }

      // Simulated event flow
      const mockEvents = ["AdLoaded", "AdStarted", "AdImpression"];
      setEvents(mockEvents.map((e) => `Fired: ${e}`));

      // No real trackers by default in VPAID
      setTrackers([]);

      addMessage({
        title: "VPAID Parser",
        text: "Loaded and initialized VPAID creative (mock flow).",
        type: "success",
      });

      return { success: true };
    } catch (err) {
      console.error("VPAID Parser Error:", err);
      addMessage({
        title: "VPAID Parser",
        text: "Unexpected error while parsing the VPAID tag.",
        type: "error",
      });
      return { success: false };
    }
  };

  return { parseVPAID };
}
