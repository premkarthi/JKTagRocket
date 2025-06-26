import { IconBase } from "react-icons";

export default function FeatureCard({ title, description, ctaText }) {
    return (
        <div className="feature-card">
            <h3>  {title}</h3>
            <p>{description}</p>
            <button className="btn btn-primary feature-cta">{ctaText}</button>
        </div>
    );
}