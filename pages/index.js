import Header from '../components/Header';
import FeatureGrid from '../components/FeatureGrid';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Head from 'next/head'

export default function Home() {
    return (
        <>
            <Head>
                <title>JK Tag Rocket</title>
                <link rel="icon" href="/images/favicon.png" />
            </Head>
            <Header />
            <div className='main'>
                <div className='sideAd'>
                    <img src='/images/ad1.png' alt='Side Ad' />
                </div>
                <div className="container">
                    <Hero />
                    <FeatureGrid />
                </div>
                <div className='sideAd'>
                    <img src='/images/ad1.png' alt='Side Ad' />
                </div>
            </div>

            <Footer />
        </>

    );
}