
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {

    const { role } = useAuth();

    const getLinkClass = ({ isActive }) =>
        `nav-link ${isActive ? "active" : ""}`;

    return (
        <aside className="custom-sidebar">

            {/* Sidebar Brand */}
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">
                    <i className="bi bi-shop"></i>
                </div>

                <div className="sidebar-brand-text">
                    <h5>Restaurant</h5>
                    <span>Management System</span>
                </div>
            </div>


            {/* Sidebar Navigation */}
            <div className="sidebar-navigation">
                <ul className="nav flex-column">

                    {/* Dashboard */}
                    <li className="nav-item">
                        <NavLink
                            to="/dashboard"
                            className={getLinkClass}
                        >
                            <i className="nav-icon bi bi-speedometer2"></i>
                            <p>Dashboard</p>
                        </NavLink>
                    </li>


                    {/* Users - Admin Only */}
                    {role === "admin" && (
                        <>
                            <li className="nav-item">
                                <NavLink
                                    to="/users"
                                    className={getLinkClass}
                                >
                                    <i className="nav-icon bi bi-people"></i>
                                    <p>Users</p>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink
                                    to="/users-trash"
                                    className={getLinkClass}
                                >
                                    <i className="nav-icon bi bi-trash"></i>
                                    <p>Users Trash</p>
                                </NavLink>
                            </li>
                        </>
                    )}


                    {/* Menus - Admin and User */}
                    {(role === "admin" || role === "user") && (
                        <>
                            <li className="nav-item">
                                <NavLink
                                    to="/menus"
                                    className={getLinkClass}
                                >
                                    <i className="nav-icon bi bi-list-ul"></i>
                                    <p>Menus</p>
                                </NavLink>
                            </li>

                            {/* Menus Trash - Admin Only */}
                            {role === "admin" && (
                                <li className="nav-item">
                                    <NavLink
                                        to="/menus-trash"
                                        className={getLinkClass}
                                    >
                                        <i className="nav-icon bi bi-trash"></i>
                                        <p>Menus Trash</p>
                                    </NavLink>
                                </li>
                            )}
                        </>
                    )}

                </ul>


                

            </div>

        </aside>
    );
}

export default Sidebar;
