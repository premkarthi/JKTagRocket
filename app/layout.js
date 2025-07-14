
"use client";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Link from 'next/link';
import Image from 'next/image';
import '../styles/globals.css'
import { usePathname } from 'next/navigation';


export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const isHome = pathname === '/';
  return (
    <html lang="en">
      <body>
        <Header />

        <div className="main">
            {/* Left side  Ad */}
          <div className="sideAd">
            <Link href="https://jktagrocket.com/tools/display-ads/" target="_blank">
              <Image src="/images/160x600-leftside.jpeg" alt="Left Ad" width={160} height={600} />
            </Link>
          </div>
            {/* Top Ad */}
          <div className="container">
            {/* <div className="topAd" style={{ textAlign: 'center' }}>
              <Link href="https://example.com/top-ad" target="_blank">
                <Image src="/images/970x90-topheader.jpg" alt="Top Ad" width={970} height={90} />
              </Link>
            </div> */}

            {children}

            <div className="bottomAd" style={{ textAlign: 'center' }}>
                {/* Home page bottom only Ad */}
              {isHome ? (
                <Link href="https://jktagrocket.com/tools/data-tools/" target="_blank">
                  <Image src="/images/970x250-bottomad.jpg" alt="Home Bottom Ad" width={970} height={250} />
                </Link>
              ) : (
                <Link href="https://jktagrocket.com/tools/video-validator/" target="_blank">
                  <Image src="/images/728x90-bottomallapges.jpg" alt="Bottom Ad" width={728} height={90} />
                </Link>
              )}
            </div>
          </div>
              {/* right side  Ad */}
          <div className="sideAd">
            <Link href="https://jktagrocket.com/tools/native-ads/" target="_blank">
              <Image src="/images/160x600-right.jpg" alt="Right Ad" width={160} height={600} />
            </Link>
          </div>
        </div>

        <Footer />
      </body>
    </html>
  );
}
