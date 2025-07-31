"use client";

import Head from 'next/head';
import Hero from '../components/Hero';
import FeatureGrid from '../components/FeatureGrid';
import ReviewsSection from '../components/ReviewsSection'; // ← NEW

export default function Home() {
  return (
    <>
      <Head>
        <title>JK Tag Rocket</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Hero />

        <div id="learn-more">
          <FeatureGrid />
        </div>

        <ReviewsSection /> {/* ← Inserted here */}
      </main>
    </>
  );
}
