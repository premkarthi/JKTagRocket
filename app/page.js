import Header from '../components/Header';
import FeatureGrid from '../components/FeatureGrid';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Head from 'next/head'
import Faq from '../components/Faq';
import Image from 'next/image';

export default function Home() {
    // const title = 'How do I preview an HTML5 ad?'
    // const list = ['Preview an HTML5 ad by uploading an HTML5 zip file', 'View a live ad preview, images of each frame, and a video of the ad', 'View network timelines, load times, file sizes, and more to ensure ads are compliant', 'Share with clients and get feedback']

    return (
        <>
            <Head>
                <title>JK Tag Rocket</title>
                {/* <link rel="icon" href="/images/browsertab_icon.png" /> */}
                <link rel="icon" href="/favicon.ico" sizes="77x77" />

            </Head>
            <Hero />
            <FeatureGrid />
            {/* <Faq title={title} list={list} /> */}
        </>

    );
}