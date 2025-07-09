import React from "react";

const TABS = [
    { label: "URL Encode/Decode", icon: "🔗", route: "urlencode" },
    { label: "Base64 Encode/Decode", icon: "🟰", route: "base64" },
    { label: "Comparing Data", icon: "🔀", route: "compare" },
    { label: "Bulk URL Validation", icon: "🔍", route: "bulk-url" },
    { label: "Data Manipulation", icon: "⚙️", route: "manipulate" },
];

export default function DataBeautifyTabs({ activeTab, onTabChange }) {
    return (
        <div className="dataBeautifyTabs">
            {TABS.map((tab, idx) => (
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

export { TABS };