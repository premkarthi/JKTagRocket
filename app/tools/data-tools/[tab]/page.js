import DataBeautifyClient from "../../../../components/data-beautify/DataBeautifyClient";
import '../DataBeautifyAddon.css'

export async function generateStaticParams() {
    return [
        { tab: "urlencode" },
        { tab: "base64" },
        { tab: "compare" },
        { tab: "bulk-url" },
        { tab: "manipulate" }
    ];
}

// ✅ Marked as async — required for dynamic routes
export default function Page() {
    return <DataBeautifyClient />;
}
