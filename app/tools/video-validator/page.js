"use client";

import dynamic from "next/dynamic";

// Prevent SSR since VideoValidator uses window/document APIs
const VideoValidator = dynamic(() => import("./VideoValidator"), {
  ssr: false,
});

export default function VideoValidatorPage() {
  return <VideoValidator />;
}
