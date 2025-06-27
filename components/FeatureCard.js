import Link from "next/link";

export default function FeatureCard({ title, description, ctaText, path }) {
    return (
        <Link href={path} className="feature-card-link" tabIndex={-1}>
            <div className="feature-card" tabIndex={0}>
                <h3>{title}</h3>
                <p>{description}</p>
                <button
                    className="feature-cta"
                    tabIndex={-1}
                >
                    {ctaText}
                </button>
            </div>
        </Link>
    );
}