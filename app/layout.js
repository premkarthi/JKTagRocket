import ToolsBar from "../components/ToolsBar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import '../styles/globals.css'


export default function DashboardLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Header />
                <div className='main'>
                    <div className='sideAd'>
                        <img src='/images/ad1.png' alt='Side Ad' />
                    </div>
                    <div className="container">
                        <div style={{ textAlign: 'center' }}>
                            <div className="topAd">
                                <img src='/images/ad2.png' alt="Top Ad" />
                            </div>
                        </div>
                        <ToolsBar />
                        {children}
                    </div>
                    <div className='sideAd'>
                        <img src='/images/ad1.png' alt='Side Ad' />
                    </div>
                </div>
                <Footer />
            </body>
        </html >
    )
}