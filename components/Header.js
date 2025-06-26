import Link from 'next/link';


export default function Header() {
    return (
        <header className="header" >
            <div className='container'>
                <img className="logo" src='/images/logo.svg' alt="Logo" />
                <nav className="nav">
                    <Link href="/" className='active'>Home</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                </nav>
            </div>
        </header>
    );
}