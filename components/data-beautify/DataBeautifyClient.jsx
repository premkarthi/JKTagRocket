"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../../app/tools/display-ads/DisplayAds.module.css";
import DataBeautifyTabs, { TABS } from "./DataBeautifyTabs";
import DataBeautifyPanel from "./DataBeautifyPanel";

export default function DataBeautifyClient() {
    const router = useRouter();
    const params = useParams();

    const tabParam = params?.tab;
    const tabIdx = TABS.findIndex(t => t.route === tabParam);
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
