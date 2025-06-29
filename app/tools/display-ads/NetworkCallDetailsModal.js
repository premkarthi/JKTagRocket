import styles from "./DisplayAds.module.css";

export default function NetworkCallDetailsModal({ call, onClose }) {
    if (!call) return null;

    const fields = [
        { label: "URL", value: call.name },
        { label: "Status", value: call.status },
        { label: "Type", value: call.initiatorType },
        { label: "Transfer Size", value: `${call.transferSize || 0} bytes` },
        { label: "Encoded Size", value: `${call.encodedBodySize || 0} bytes` },
        { label: "Start Time", value: `${Math.round(call.startTime)} ms` },
        { label: "Response End", value: `${Math.round(call.responseEnd)} ms` },
    ];

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
                <div className={styles.modalHeader}>
                    <strong>Network Call Details</strong>
                    <button onClick={onClose} className={styles.modalCloseBtn}>✖</button>
                </div>
                <div className={styles.modalContent}>
                    {fields.map((f, idx) => (
                        <div key={idx} className={styles.modalRow}>
                            <div className={styles.modalLabel}>{f.label}</div>
                            <div className={styles.modalValue}>{f.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
