import ToolsBar from "../../components/ToolsBar";

export default function DashboardLayout({ children }) {
    return (
        <div>
            <ToolsBar />
            {children}
        </div>
    );
}