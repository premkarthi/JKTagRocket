"use client";
import React from "react";
import TooltipOpenNewTabButton from "@components/TooltipOpenNewTabButton";
import TooltipCopyButton from "@components/TooltipcopyButton";
import Customtooltip from "@components/Customtooltip";

export default function TrackerActions({ url }) {
  if (!url) return null;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Customtooltip text="Copy to Clipboard" variant="copy">
        <TooltipCopyButton text={url} />
      </Customtooltip>

      <Customtooltip text="Open in New Tab" variant="animated">
        <TooltipOpenNewTabButton url={url} />
      </Customtooltip>
    </div>
  );
}
