
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ onToggleSidebar }) {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            navigate("/login");
        }
    };

    return (
        <nav className="custom-navbar">

            {/* Left Side */}
            <div className="navbar-left">

                <button
                    className="sidebar-toggle-btn"
                    onClick={onToggleSidebar}
                    type="button"
                    aria-label="Toggle sidebar"
                >
                    <i className="bi bi-list"></i>
                </button>

                <div className="navbar-brand">

                    <span className="navbar-title">
                        Restaurant Management
                    </span>
                </div>

            </div>


            {/* Right Side */}
            <div className="navbar-right">

                <div className="navbar-user-info">

                    <div className="navbar-user-icon">
                        <i className="bi bi-person-fill"></i>
                    </div>

                    <div className="navbar-user-details">
                        <span className="navbar-user-label">
                            Welcome back
                        </span>

                        <span
                            className="navbar-user-name"
                            title={user?.name}
                        >
                            {user?.name || "User"}
                        </span>
                    </div>

                </div>


                <button
                    className="navbar-logout-btn"
                    onClick={handleLogout}
                    type="button"
                >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Logout</span>
                </button>

            </div>

        </nav>
    );
}

export default Navbar;
