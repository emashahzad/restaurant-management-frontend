
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import "./layout.css";

function MainLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    return (
        <div className="custom-layout">

            {/* Navbar */}
            <Navbar onToggleSidebar={toggleSidebar} />


            {/* Layout Body */}
            <div className="layout-body">

                {/* Sidebar */}
                <div
                    className={`sidebar-container ${
                        sidebarOpen ? "sidebar-open" : "sidebar-closed"
                    }`}
                >
                    <Sidebar />
                </div>


                {/* Main Content */}
                <main className="main-content">

                    <div className="container-fluid p-4">
                        <Outlet />
                    </div>

                </main>

            </div>


            {/* Footer */}
            <Footer />

        </div>
    );
}

export default MainLayout;
