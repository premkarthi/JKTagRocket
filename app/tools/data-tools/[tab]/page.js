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
    // params.tab will be "urlencode", "base64", etc.
    if (params.tab === "urlencode") {
        return (
            <div className="dataBeautifyPanel">
                <div className="dataBeautifyPanelTitle">
                    <span className="dataBeautifyPanelTitleIcon" style={{ marginRight: 4 }}>
                        🔗
                    </span>
                    URL Encode &amp; Decode
                </div>
                <label className="dataBeautifyLabel">Enter URL</label>
                <textarea
                    className="dataBeautifyTextarea"
                    placeholder="Paste your URL here..."
                    rows={7}
                />
                <div className="dataBeautifyPanelActions">
                    <button className={styles.displayAdsPreviewBtn} type="button">Encode URL</button>
                    <button className={styles.displayAdsPreviewBtn} type="button">Decode URL</button>
                    <button className={styles.displayAdsResetBtn} type="button" title="Copy">
                        <span role="img" aria-label="Copy">📋</span>
                    </button>
                    <button className={styles.displayAdsResetBtn} type="button" title="Reset">
                        <span role="img" aria-label="Reset">🔄</span>
                    </button>
                </div>
            </div>
        );
    }

    // Default render
    return <DataBeautifyClient tab={params.tab} />;
}