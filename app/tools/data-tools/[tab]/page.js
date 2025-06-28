import DataBeautifyClient from "./DataBeautifyClient";

export async function generateStaticParams() {
    return [
        { tab: "urlencode" },
        { tab: "base64" },
        { tab: "compare" },
        { tab: "bulk-url" },
        { tab: "manipulate" }
    ];
}

export default function DataBeautifyToolsServer({ params }) {
    // params.tab will be "urlencode", "base64", etc.
    return <DataBeautifyClient tab={params.tab} />;
}