import React from "react";
import UrlEncodePanel from "./panels/UrlEncodePanel";
import Base64Panel from "./panels/Base64Panel";
import ComparePanel from "./panels/ComparePanel";
import BulkUrlPanel from "./panels/BulkUrlPanel";
import ManipulatePanel from "./panels/ManipulatePanel";

export default function DataBeautifyPanel({ tab }) {
    if (tab === "urlencode") return <UrlEncodePanel />;
    if (tab === "base64") return <Base64Panel />;
    if (tab === "compare") return <ComparePanel />;
    if (tab === "bulk-url") return <BulkUrlPanel />;
    if (tab === "manipulate") return <ManipulatePanel />;
    return null;
}