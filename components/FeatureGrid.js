import FeatureCard from './FeatureCard';

export default function FeatureGrid() {
    const features = [
        {
            title: "🧩 Display Ads",
            description: "Preview and validate Google AdSense display ad tags with real-time rendering and comprehensive testing.",
            ctaText: "Try now ",
            path: "/tools/display-ads",
        },
        {
            title: "📄 HTML5 Validator",
            description: "Upload and validate HTML5 ad creative files with comprehensive error reporting and syntax checking.",
            ctaText: "Try now ",
            path: "/tools/html5-validator",
        },
        {
            title: "📹 Video Validator",
            description: "Preview and validate Google AdSense video ad tags with real-time rendering and testing.",
            ctaText: "Try now ",
            path: "/tools/video-validator",
        },
        {
            title: "🧱 Native Ads",
            description: "Create and preview native ad formats with customizable layouts and responsive design testing.",
            ctaText: "Try now ",
            path: "/tools/native-ads",
        },
        {
            title: "🛠️ Data Tools",
            description: "Transform and manipulate ad data formats with advanced processing tools and utilities.",
            ctaText: "Try now ",
            path: "/tools/data-tools",
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