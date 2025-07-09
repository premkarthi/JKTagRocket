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

export default function Page({ params }) {
    // params.tab will be "urlencode", "base64", etc.
    return <DataBeautifyClient tab={params.tab} />;
}