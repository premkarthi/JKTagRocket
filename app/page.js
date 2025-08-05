// app/page.js
"use client";

import Hero from "../components/Hero";
import FeatureGrid from "../components/FeatureGrid";
import ReviewsSection from "../components/ReviewsSection";

export default function Home() {
  return (
    <main>
      <Hero />

      <div id="learn-more">
        <FeatureGrid />
      </div>

      <ReviewsSection />
    </main>
  );
}
