import Footer from "../components/Footer";
import Header from "../components/Header";
import Image from 'next/image';
import '../styles/globals.css'


export default function DashboardLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Header />
                <div className='main'>
                    <div className='sideAd'>
                        <Image src='/images/ad1.png' alt='Side Ad' width={160} height={600} />
                    </div>
                    <div className="container">
                        <div style={{ textAlign: 'center' }}>
                            <div className="topAd">
                                <Image src='/images/ad2.png' alt='Side Ad' width={768} height={90} />
                            </div>
                        </div>
                        {children}
                    </div>
                    <div className='sideAd'>
                        <Image src='/images/ad1.png' alt='Side Ad' width={160} height={600} />
                    </div>
                </div>
                <Footer />
            </body>
        </html >
    )
}