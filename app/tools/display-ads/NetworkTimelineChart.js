"use client";

import React, { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import styles from "./DisplayAds.module.css";

const COLOR = {
    Images: "#60a5fa",
    JS: "#34d399",
    CSS: "#f59e0b",
    XHR: "#a78bfa",
    Font: "#fb7185",
    Other: "#9ca3af",
};

const LEGEND_TYPES = Object.keys(COLOR);
const ALL_TYPE = "All";
const legendData = [ALL_TYPE, ...LEGEND_TYPES];

const fmt = (ms) => `${Math.round(ms)} ms`;

function normalise(data) {
    const clean = data.filter(d => Number.isFinite(d.start) && d.start >= 0);
    if (!clean.length) return [];

    return clean.map((d, idx) => {
        let duration = d.duration;
        if (!duration || duration <= 0) {
            duration = (d.end || 0) - (d.start || 0);
            if (duration <= 0) duration = 1;
        }
        return {
            id: idx,
            url: d.url,
            type: d.type in COLOR ? d.type : "Other",
            start: d.start,
            duration: duration,
            raw: d,
        };
    }).sort((a, b) => a.start - b.start);
}

export default function NetworkTimelineChart({ timeline = [] }) {
    const [selectedType, setSelectedType] = useState(ALL_TYPE);
    const [tooltipContent, setTooltipContent] = useState(null);

    const allData = useMemo(() => normalise(timeline), [timeline]);

    const filteredData = useMemo(() => {
        return selectedType === ALL_TYPE
            ? allData
            : allData.filter((d) => d.type === selectedType);
    }, [allData, selectedType]);

    const cats = useMemo(
        () => filteredData.map((d) => `${d.type + ' - ' + d.url}`),
        [filteredData]
    );

    const option = useMemo(() => {
        const max = Math.max(...filteredData.map((d) => d.start + d.duration), 0);
        return {
            legend: {
                data: legendData,
                selected: legendData.reduce(
                    (acc, t) => ({ ...acc, [t]: t === selectedType }),
                    {}
                ),
                selectedMode: "single",
                top: 0,
                left: 0,
                textStyle: { fontSize: 12 },
            },
            tooltip: {
                show: false,
                formatter: (p) => {
                    const d = filteredData[p.dataIndex];
                    return Object.entries(d.raw || d)
                        .map(([k, v]) => `<b>${k}</b>: ${typeof v === "number" ? fmt(v) : v}`)
                        .join("<br/>");
                },
            },
            grid: { left: 470, right: 20, top: 40, bottom: 40 },
            xAxis: {
                type: "value",
                min: 0,
                max: max + 100,
                name: "ms",
                nameLocation: "end",
                axisLabel: { formatter: "{value}" },
            },
            yAxis: {
                type: "category",
                inverse: true,
                data: cats,
                axisLabel: {
                    width: 450,
                    overflow: "truncate",
                    formatter: (label, index) => {
                        return `{link|${label}}`;
                    },
                    rich: {
                        link: {
                            fontWeight: "bold",
                            cursor: "pointer",
                            align: "left",
                        },
                    },
                },
            },
            series: [
                {
                    type: "custom",
                    renderItem(params, api) {
                        const categoryIndex = api.value(0);
                        const start = api.value(1);
                        const dur = api.value(2);
                        const coordStart = api.coord([start, categoryIndex]);
                        const coordEnd = api.coord([start + dur, categoryIndex]);
                        const barHeight = api.size([0, 1])[1] * 0.8;

                        return {
                            type: "rect",
                            shape: {
                                x: coordStart[0],
                                y: coordStart[1] - barHeight / 2,
                                width: Math.max(coordEnd[0] - coordStart[0], 1),
                                height: barHeight,
                            },
                            style: api.style({
                                fill: COLOR[filteredData[params.dataIndex].type],
                            }),
                        };
                    },
                    data: filteredData.map((d) => [d.id, d.start, d.duration, d]),
                },
            ],
        };
    }, [filteredData, selectedType, cats]);

    const onEvents = {
        legendselectchanged: (e) => {
            const sel = Object.entries(e.selected).find(([_, v]) => v);
            setSelectedType(sel?.[0] || ALL_TYPE);
            setTooltipContent(null);
        },
        click: (e) => {
            if (e.data && e.data[3]) {
                const d = e.data[3];
                const html = Object.entries(d.raw || d)
                    .map(([k, v]) => `<b>${k}</b>: ${typeof v === "number" ? fmt(v) : v}`)
                    .join("<br/>");
                setTooltipContent(html);
            } else if (e.componentType === "yAxis") {
                const idx = e.value; // label text
                const full = allData.find((d) =>
                    d.url.endsWith(idx) || d.url.includes(idx)
                );
                if (full) {
                    const html = Object.entries(full.raw || full)
                        .map(([k, v]) => `<b>${k}</b>: ${typeof v === "number" ? fmt(v) : v}`)
                        .join("<br/>");
                    setTooltipContent(html);
                }
            }
        },
    };

    if (!allData.length) {
        return (
            <div className={styles.networkTimelineBlock}>
                <div style={{ padding: 16, color: "#888" }}>No network calls captured.</div>
            </div>
        );
    }

    return (
        <div className={styles.networkTimelineBlock}>
            <ReactECharts
                option={option}
                onEvents={onEvents}
                style={{ height: Math.max(200, filteredData.length * 28) }}
                opts={{ renderer: "canvas" }}
            />
            {tooltipContent && (
                <div
                    style={{
                        padding: 12,
                        marginTop: 8,
                        background: "#f9fafb",
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        wordBreak: "break-all",
                        whiteSpace: "pre-wrap",
                        fontFamily: "monospace",
                    }}
                >
                    <div dangerouslySetInnerHTML={{ __html: tooltipContent }} />
                </div>
            )}
        </div>
    );
}
