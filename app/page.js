"use client";

import Head from "next/head";
import Hero from "../components/Hero";
import FeatureGrid from "../components/FeatureGrid";
import ReviewsSection from "../components/ReviewsSection";
import reviews from "../public/data/reviews.json";

export default function Home() {
  return (
    <>
      <Head>
        <title>JK Tag Rocket</title>
        <link rel="icon" href="/favicon.ico" />

        {/* SEO Structured Data for Reviews */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "JK Tag Rocket",
              url: "https://jktagrocket.com",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                reviewCount: reviews.length.toString()
              },
              review: reviews.map((r) => ({
                "@type": "Review",
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: r.stars,
                  bestRating: "5"
                },
                author: {
                  "@type": "Person",
                  name: r.author
                },
                reviewBody: r.text
              }))
            })
          }}
        />
      </Head>

      <main>
        <Hero />

        <div id="learn-more">
          <FeatureGrid />
        </div>

        <ReviewsSection />
      </main>
    </>
  );
}
