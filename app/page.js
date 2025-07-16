import Head from 'next/head';
// import Header from '../components/Header';
import Hero from '../components/Hero';
import FeatureGrid from '../components/FeatureGrid';
// import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>JK Tag Rocket</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Header /> */}
      <Hero />

      {/* This is the Learn More anchor point */}
      <div id="learn-more">
        <FeatureGrid />
      </div>

      {/* <Footer /> */}
    </>
  );
}
