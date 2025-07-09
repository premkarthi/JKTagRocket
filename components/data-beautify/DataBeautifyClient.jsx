"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "../../app/tools/display-ads/DisplayAds.module.css";
import DataBeautifyTabs, { TABS } from "./DataBeautifyTabs";
import DataBeautifyPanel from "./DataBeautifyPanel";

export default function DataBeautifyClient({ tab }) {
    const router = useRouter();
    const tabIdx = TABS.findIndex(t => t.route === tab);
    const activeTab = tabIdx === -1 ? 0 : tabIdx;

    const handleTabChange = (route) => {
        router.push(`/tools/data-tools/${route}`);
    };

    return (
        <div className={styles.displayAdsContainer + " dataBeautifyContainer"}>
            <h1 className={styles.displayAdsHeader}>
                Data Beautify Tools
            </h1>
            <div className={styles.displayAdsSubtitle}>
                Transform and manipulate ad data with powerful utilities
            </div>
            <div className="dataBeautifyTabsCard">
                <DataBeautifyTabs
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />
                <DataBeautifyPanel tab={TABS[activeTab].route} />
            </div>
        </div>
    );
}