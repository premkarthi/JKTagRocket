import ToolsBar from "../../components/ToolsBar";
import "@styles/GlobalMessage.css"; // Adjust path based on your structure


export default function DashboardLayout({ children }) {
    return (
        <div>
            <ToolsBar />
            {children}
        </div>
    );
}