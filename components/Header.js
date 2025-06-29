import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    return (
        <header className="header" >
            <div className='container'>
                <Image src='/images/logo.svg' alt="Header Logo" width={150} height={30} />
                <nav className="nav">
                    <Link href="/" className='active'>Home</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                </nav>
            </div>
        </header>
    );
}