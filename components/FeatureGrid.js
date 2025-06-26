import FeatureCard from './FeatureCard';

export default function FeatureGrid() {
    const features = [
        {
            title: "🧩 Display Ads",
            description: "Preview and validate Google AdSense display ad tags with real-time rendering and comprehensive testing.",
            ctaText: "Try now "
        },
        {
            title: "📄 HTML5 Validator",
            description: "Upload and validate HTML5 ad creative files with comprehensive error reporting and syntax checking.",
            ctaText: "Try now "
        },
        {
            title: "📹 Video Validator",
            description: "Preview and validate Google AdSense video ad tags with real-time rendering and testing.",
            ctaText: "Try now "
        },
        {
            title: "🧱 Native Ads",
            description: "Create and preview native ad formats with customizable layouts and responsive design testing.",
            ctaText: "Try now "
        },
        {
            title: "🛠️ Data Tools",
            description: "Transform and manipulate ad data formats with advanced processing tools and utilities.",
            ctaText: "Try now "
        }
    ];

    return (
        <section className="feature-grid">
            <div className="grid">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>
        </section>
    );
}