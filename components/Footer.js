import Image from 'next/image';
export default function Footer() {
    const products = [
        "Privacy Policy",
        "Terms of Service",
        "Contact",
    ];

    return (
        <footer className="footer">
            <Image src='/images/logo.svg' alt="Footer Logo" width={150} height={40} />
            <div className="footer-notice">
                <p>Professional ad tag utilities for modern developers</p>
            </div>

            <div className="footer-products">
                {products.map((product, index) => (
                    <a href="#" className="product" key={index}>{product}</a>
                ))}
            </div>
        </footer>
    );
}