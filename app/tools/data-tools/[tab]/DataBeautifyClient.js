"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "../../display-ads/DisplayAds.module.css";
import "../DataBeautifyAddon.css";

const TABS = [
    { label: "URL Encode/Decode", icon: "🔗", route: "urlencode" },
    {
        label: "Base64 Encode/Decode", icon: "🟰", route: "base64"
    },
    { label: "Comparing Data", icon: "🔀", route: "compare" },
    { label: "Bulk URL Validation", icon: "🔍", route: "bulk-url" },
    { label: "Data Manipulation", icon: "⚙️", route: "manipulate" },
];

function DataBeautifyTabs({ tabs, activeTab, onTabChange }) {
    return (
        <div className="dataBeautifyTabs">
            {tabs.map((tab, idx) => (
                <button
                    key={tab.route}
                    className={
                        "dataBeautifyTab" + (activeTab === idx ? " dataBeautifyTabActive" : "")
                    }
                    onClick={() => onTabChange(tab.route)}
                    type="button"
                >
                    <span className="dataBeautifyTabIcon">{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
}

function DataBeautifyPanel({ tab }) {
    if (tab === "urlencode") {
        return (
            <div className="dataBeautifyPanel">
                <div className="dataBeautifyPanelTitle">
                    <span className="dataBeautifyPanelTitleIcon">🔗</span>
                    URL Encode &amp; Decode
                </div>
                <label className="dataBeautifyLabel">Enter URL or Text</label>
                <textarea
                    className="dataBeautifyTextarea"
                    placeholder="Paste your URL here..."
                    rows={7}
                />
                <div className="dataBeautifyPanelActions">
                    <button className="dataBeautifyMainBtn" type="button">Encode URL</button>
                    <button className="dataBeautifyOutlineBtn" type="button">Decode URL</button>
                    <button className="dataBeautifyIconBtn" type="button" title="Copy">
                        <span role="img" aria-label="Copy">📋</span>
                    </button>
                    <button className="dataBeautifyIconBtn" type="button" title="Reset">
                        <span role="img" aria-label="Reset">🔄</span>
                    </button>
                </div>
            </div>
        );
    }
    if (tab === "base64") {
        return (
            <div className="dataBeautifyPanel">
                <div className="dataBeautifyPanelTitle">
                    <span className="dataBeautifyPanelTitleIcon" style={{ marginRight: 4 }}>
                        🟰
                    </span>
                    Base64 Encode &amp; Decode
                </div>
                <label className="dataBeautifyLabel">Enter Text</label>
                <textarea
                    className="dataBeautifyTextarea"
                    placeholder="Paste your text here..."
                    rows={7}
                />
                <div className="dataBeautifyPanelActions">
                    <button className="dataBeautifyMainBtn" type="button">Encode</button>
                    <button className="dataBeautifyOutlineBtn" type="button">Decode</button>
                    <button className="dataBeautifyIconBtn" type="button" title="Copy">
                        <span role="img" aria-label="Copy">📋</span>
                    </button>
                    <button className="dataBeautifyIconBtn" type="button" title="Reset">
                        <span role="img" aria-label="Reset">🔄</span>
                    </button>
                </div>
            </div>
        );
    }
    if (tab === "compare") {
        return (
            <div className="dataBeautifyPanel">
                <div className="dataBeautifyPanelTitle">
                    <span className="dataBeautifyPanelTitleIcon">🔀</span>
                    Comparing Data
                </div>
                <div style={{ color: "#b3b3cb", fontStyle: "italic", padding: 24 }}>
                    Feature coming soon...
                </div>
            </div>
        );
    }
    if (tab === "bulk-url") {
        return (
            <div className="dataBeautifyPanel">
                <div className="dataBeautifyPanelTitle">
                    <span className="dataBeautifyPanelTitleIcon">🔍</span>
                    Bulk URL Validation
                </div>
                <div style={{ color: "#b3b3cb", fontStyle: "italic", padding: 24 }}>
                    Feature coming soon...
                </div>
            </div>
        );
    }
    if (tab === "manipulate") {
        return (
            <div className="dataBeautifyPanel">
                <div className="dataBeautifyPanelTitle">
                    <span className="dataBeautifyPanelTitleIcon">⚙️</span>
                    Data Manipulation
                </div>
                <div style={{ color: "#b3b3cb", fontStyle: "italic", padding: 24 }}>
                    Feature coming soon...
                </div>
            </div>
        );
    }
    return null;
}

export default function DataBeautifyClient({ tab }) {
    const router = useRouter();
    const tabIdx = TABS.findIndex(t => t.route === tab);
    const activeTab = tabIdx === -1 ? 0 : tabIdx;

    const handleTabChange = (route) => {
        router.push(`/tools/data-tools/${route}`);
    };

    return (
        <div className={styles.displayAdsContainer + " dataBeautifyContainer"}>
            <h1 className={styles.displayAdsHeader + " dataBeautifyHeader"}>
                Data Beautify Tools
            </h1>
            <div className={styles.displayAdsSubtitle + " dataBeautifySubtitle"}>
                Transform and manipulate ad data with powerful utilities
            </div>
            <div className="dataBeautifyTabsCard">
                <DataBeautifyTabs
                    tabs={TABS}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />
                <DataBeautifyPanel tab={TABS[activeTab].route} />
            </div>
        </div>
    );
}