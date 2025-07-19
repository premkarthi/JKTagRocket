// app/page.js
"use client";

import Head from 'next/head';
import Hero from '../components/Hero';
import FeatureGrid from '../components/FeatureGrid';

export default function Home() {
  return (
    <>
      <Head>
        <title>JK Tag Rocket</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* <h1>Welcome to TagRocket</h1> */}
        <Hero />

        <div id="learn-more">
          <FeatureGrid />
        </div>
      </main>
    </>
  );
}
