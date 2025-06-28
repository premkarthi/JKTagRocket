import { redirect } from "next/navigation";

export default function DataToolsRoot() {
    redirect("/tools/data-tools/urlencode");
    return null;
}