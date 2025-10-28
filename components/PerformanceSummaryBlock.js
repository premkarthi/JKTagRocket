export default function PerformanceSummaryBlock({ summary }) {
    if (!summary) return null;
    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid #ececf1",
                borderRadius: "12px",
                boxShadow: "0 2px 10px 0 #e7e7f2",
                padding: "24px 20px 12px 20px",
                margin: "24px 0",
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "18px",
            }}
        >
            <div>
                <div style={{ color: "#888", fontSize: 12, marginBottom: 2 }}>
                    Requests
                </div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>
                    {summary.requests}
                </div>
            </div>
            <div>
                <div style={{ color: "#888", fontSize: 12, marginBottom: 2 }}>
                    Domains
                </div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>
                    {summary.domains}
                </div>
            </div>
            <div>
                <div style={{ color: "#888", fontSize: 12, marginBottom: 2 }}>
                    Transfer Size
                </div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>
                    {summary.transfer}
                </div>
            </div>
            <div>
                <div style={{ color: "#888", fontSize: 12, marginBottom: 2 }}>
                    Content Size
                </div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>
                    {summary.content}
                </div>
            </div>
            <div>
                <div style={{ color: "#888", fontSize: 12, marginBottom: 2 }}>
                    DOMContentLoaded
                </div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>
                    {summary.domContentLoaded}
                </div>
            </div>
            <div>
                <div style={{ color: "#888", fontSize: 12, marginBottom: 2 }}>
                    First Paint
                </div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>
                    {summary.firstPaint}
                </div>
            </div>
            <div>
                <div style={{ color: "#888", fontSize: 12, marginBottom: 2 }}>
                    Load Time
                </div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>
                    {summary.loadTime}
                </div>
            </div>
        </div>
    );
}