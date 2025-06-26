export default function Hero() {
    return (
        <section className="hero">
            <div className='topAd'>
                <img src='/images/ad2.png' alt="Top Ad" />
            </div>
            <div className="hero-content">
                <div className="hero-main">
                    <p className="tag">🚀 Professional Ad Tag Utilities</p>
                    <div>
                        <img className="logo-large" src='/images/logo.svg' />
                    </div>
                    <p className="hero-description">
                        Professional ad tag utilities for previews, validation, and data transformation.
                        Built for speed, precision, and developer productivity.
                    </p>

                    <div className="hero-buttons">
                        <button className="btn btn-primary">Get Started</button>
                        <button className="btn btn-outline">Learn More</button>
                    </div>
                </div>
            </div>
        </section>
    );
}