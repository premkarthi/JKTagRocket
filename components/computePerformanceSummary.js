import { formatMs, formatSize } from "./utils";

export default function computePerformanceSummary(resources = [], timings = {}) {
    const domains = new Set();
    let transfer = 0, content = 0;

    resources.forEach((r) => {
        try {
            domains.add(new URL(r.name).hostname);
        } catch { /* ignore malformed URLs */ }

        if (typeof r.transferSize === "number" && r.transferSize)
            transfer += r.transferSize;

        if (typeof r.encodedBodySize === "number" && r.encodedBodySize)
            content += r.encodedBodySize;
    });

    return {
        requests: resources.length,
        domains: domains.size,
        transfer: formatSize(transfer),
        content: formatSize(content),
        domContentLoaded: formatMs(timings.domContentLoaded ?? 0),
        firstPaint: formatMs(timings.firstPaint ?? 0),
        loadTime: formatMs(timings.loadTime ?? 0),
    };
}
