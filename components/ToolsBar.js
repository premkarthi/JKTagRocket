"use client";

import { useRouter, usePathname } from "next/navigation";
import React from "react";
import clsx from "clsx";
import Link from "next/link";

// Example icon components (replace with your own or with SVGs)
const DisplayAdsIcon = () => <span className="mr-2">🧩</span>;
const HTML5Icon = () => <span className="mr-2">📄</span>;
const VideoIcon = () => <span className="mr-2">🎬</span>;
const NativeAdsIcon = () => <span className="mr-2">🧊</span>;
const DataToolsIcon = () => <span className="mr-2">💼</span>;

const tools = [
    {
        label: "Display Ads",
        icon: <DisplayAdsIcon />,
        path: "/tools/display-ads",
    },
    {
        label: "HTML5 Validator",
        icon: <HTML5Icon />,
        path: "/tools/html5-validator",
    },
    {
        label: "Video Validator",
        icon: <VideoIcon />,
        path: "/tools/video-validator",
    },
    {
        label: "Native Ads",
        icon: <NativeAdsIcon />,
        path: "/tools/native-ads",
    },
    {
        label: "Data Tools",
        icon: <DataToolsIcon />,
        path: "/tools/data-tools",
    },
];

export default function ToolsBar() {
    const router = useRouter();
    const pathname = usePathname();

    // Helper to remove trailing slash for comparison
    const normalize = (path) => path.replace(/\/$/, "");
    console.log(pathname);
    return (
        <nav className="toolsTabs-nav">
            <Link href={'/'} className="toolsTabs-label">All Tools</Link>
            {tools.map((tool) => {
                const isActive = normalize(pathname).includes(normalize(tool.path));
                return (
                    <button
                        key={tool.label}
                        onClick={() => router.push(tool.path)}
                        className={clsx(
                            "toolsTabs-btn",
                            isActive && "active"
                        )}
                        aria-current={isActive ? "page" : undefined}
                        type="button"
                    >
                        {tool.icon}
                        {tool.label}
                    </button>
                );
            })}
        </nav>
    );
}