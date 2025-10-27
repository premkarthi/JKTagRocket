
export const RESOURCE_TYPE_FILTERS = [
    { label: "Images", types: ["img", "image"] },
    { label: "XHR", types: ["fetch", "xhr", "xmlhttprequest"] },
    { label: "JS", types: ["script"] },
    { label: "CSS", types: ["stylesheet", "css"] },
    { label: "Font", types: ["font"] },
    { label: "Other", types: ["other"] },
];
export const formatSize = (b) => (!b && b !== 0 ? "-" : b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`);
export const formatMs = (ms) => (typeof ms === "number" && !Number.isNaN(ms) ? `${Math.round(ms)} ms` : "-");

export function getResourceType(entry) {
    const t = (entry.initiatorType || entry.resourceType || "").toLowerCase();
    if (t === "xmlhttprequest" || t === "fetch") return "XHR";
    if (t === "img" || t === "image") return "Images";
    if (t === "script") return "JS";
    if (t === "stylesheet" || t === "css") return "CSS";
    if (t === "font") return "Font";
    return "Other";
}