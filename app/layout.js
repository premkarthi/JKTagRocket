// app/layout.js
import "../styles/globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import UserIdTracker from "../components/UserIdTracker";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GlobalMessageProvider } from "../components/useGlobalMessage";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JK Tag Rocket",
  description: "Paste ad tags, preview & inspect network calls",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXX', { send_page_view: true });
            `,
          }}
        />

        {/* SEO Structured Data */}
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
                reviewCount: "23"
              },
              review: []
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <GlobalMessageProvider>
          <UserIdTracker />
          <Header />

          <div className="main">
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

            <div className="container">{children}</div>

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

          <Footer />
        </GlobalMessageProvider>
      </body>
    </html>
  );
}
