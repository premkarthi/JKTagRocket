// app/layout.js
import "../styles/globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import UserIdTracker from "../components/UserIdTracker";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JK Tag Rocket",
  description: "Paste ad tags, preview & inspect network calls",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 (Replace G-XXXXXXX with your real ID) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXX', {
                send_page_view: true
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <UserIdTracker />
        <Header />

        <div className="main">
          {/* Left Ad */}
          <div className="sideAd">
            <Link href="https://jktagrocket.com/tools/display-ads/" target="_blank">
              <Image
                src="/images/160x600-leftside.jpeg"
                alt="Left Ad"
                width={160}
                height={600}
              />
            </Link>
          </div>

          {/* Main Content */}
          <div className="container">{children}</div>

          {/* Right Ad */}
          <div className="sideAd">
            <Link href="https://jktagrocket.com/tools/native-ads/" target="_blank">
              <Image
                src="/images/160x600-right.jpg"
                alt="Right Ad"
                width={160}
                height={600}
              />
            </Link>
          </div>
        </div>

        {/* Bottom Ad */}
        <div className="bottomAd" style={{ textAlign: "center" }}>
          {/* <Link href="https://jktagrocket.com/tools/video-validator/" target="_blank">
            <Image
              src="/images/728x90-bottomallapges.jpg"
              alt="Bottom Ad"
              width={728}
              height={90}
            />
          </Link> */}
          <Link href="https://jktagrocket.com/tools/html5-validator/" target="_blank">
            <Image
              src="/images/970x90-topheader.jpg"
              alt="Top Ad Banner"
              width={970}
              height={90}
              priority
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Link>
        </div>

        <Footer />
      </body>
    </html>
  );
}
