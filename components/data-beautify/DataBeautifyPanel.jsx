import React from "react";
import UrlEncodePanel from "./panels/Urlencodedecode";
import Base64Panel from "./panels/Base64encodedecode";
import ComparePanel from "./panels/Comparedata";
import BulkUrlPanel from "./panels/Bulkurlvalidation";
import ManipulatePanel from "./panels/Datamanipulation";

export default function DataBeautifyPanel({ tab }) {
    if (tab === "urlencode") return <UrlEncodePanel />;
    if (tab === "base64") return <Base64Panel />;
    if (tab === "compare") return <ComparePanel />;
    if (tab === "bulk-url") return <BulkUrlPanel />;
    if (tab === "manipulate") return <ManipulatePanel />;
    return null;
}