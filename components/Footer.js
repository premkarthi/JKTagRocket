import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const products = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="footer">
      <Image src='/images/logo.svg' alt="Footer Logo" width={150} height={40} />

      <div className="footer-notice">
        <p>Professional ad tag utilities for modern developers</p>
      </div>

      <div className="footer-products">
        {products.map((product, index) => (
          <Link href={product.href} key={index} className="product">
            {product.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
