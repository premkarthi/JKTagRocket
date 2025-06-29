import { formatMs, formatSize, getResourceType } from "./utils";
import './DisplayAds.module.css'

export default function NetworkCallsTable({ calls = [], onViewDetails, colorMap }) {
    if (!calls.length) return null;

    return (
        <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: "bold", marginBottom: 8 }}>Network Calls</div>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
                            <th style={{ padding: 8 }}>URL</th>
                            <th style={{ padding: 8 }}>Type</th>
                            <th style={{ padding: 8 }}>Status</th>
                            <th style={{ padding: 8 }}>Transfer Size</th>
                            <th style={{ padding: 8 }}>Content Size</th>
                            <th style={{ padding: 8 }}>Start</th>
                            <th style={{ padding: 8 }}>End</th>
                            <th style={{ padding: 8 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {calls.map((c, i) => (
                            <tr key={i} className="networkRowAccent" style={{ "--accent": colorMap[getResourceType(c)] }}>
                                <td style={{ padding: 8, wordBreak: "break-all" }}>{c.name}</td>
                                <td style={{ padding: 8 }}>{getResourceType(c)}</td>
                                <td style={{ padding: 8 }}>{c.status}</td>
                                <td style={{ padding: 8 }}>{formatSize(c.transferSize)}</td>
                                <td style={{ padding: 8 }}>{formatSize(c.encodedBodySize)}</td>
                                <td style={{ padding: 8 }}>{formatMs(c.startTime)}</td>
                                <td style={{ padding: 8 }}>{formatMs(c.responseEnd)}</td>
                                <td style={{ padding: 8 }}>
                                    <button onClick={() => onViewDetails?.(c)} style={{ fontSize: 12, padding: "2px 6px" }}>Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}