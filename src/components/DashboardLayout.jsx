
import { Outlet } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";

function DashboardLayout() {

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>

            <Sidebar />

            <div style={{ flex: 1, padding: "20px" }}>
                <Outlet />
            </div>

        </div>
    );
}

export default DashboardLayout;
