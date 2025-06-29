import ToolsBar from "./ToolsBar";
import Image from "next/image";



export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">
                <div className="hero-main">
                    <p className="tag">🚀 Professional Ad Tag Utilities</p>
                    <div>
                        <Image src='/images/logo.svg' alt="Logo middle" width={150} height={40} />
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