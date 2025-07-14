"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();

    const isActive = (href) => pathname === href;

    return (
        <header className="header">
            <div className="container">
                <Image src="/images/logo.svg" alt="Header Logo" width={150} height={33} />
                <nav className="nav">
                    <Link href="/" className={isActive("/") ? "active" : ""}>Home</Link>
                    <Link href="/about" className={isActive("/about/") ? "active" : ""}>About</Link>
                    <Link href="/contact" className={isActive("/contact/") ? "active" : ""}>Contact</Link>
                </nav>
            </div>
        </header>
    );
}
