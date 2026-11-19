
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function Dashboard() {

    const { user, role } = useAuth();
    const navigate = useNavigate();

    const [totalMenus, setTotalMenus] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch Dashboard Data
    useEffect(() => {

        const fetchDashboardData = async () => {

            setLoading(true);
            setError("");

            try {

                const menusResponse = await api.get("/menus");

                setTotalMenus(
                    menusResponse.data.menus?.length || 0
                );

                if (role === "admin") {

                    const usersResponse = await api.get("/users");

                    setTotalUsers(
                        usersResponse.data.User?.length || 0
                    );

                }

            } catch (error) {

                console.error("Dashboard API Error:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard data."
                );

            } finally {

                setLoading(false);

            }

        };

        if (role === "admin" || role === "user") {
            fetchDashboardData();
        } else {
            setLoading(false);
        }

    }, [role]);


    // Keyboard accessibility for clickable cards
    const handleCardKeyDown = (e, path) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(path);
        }
    };


    return (
        <div className="container-fluid dashboard-page">

            {/* Page Heading */}
            <div className="dashboard-heading mb-4">
                <div>
                    <h2>Dashboard</h2>
                    <p>Restaurant Management Overview</p>
                </div>

                <div className="dashboard-date">
                    <i className="bi bi-grid-1x2-fill"></i>
                    Overview
                </div>
            </div>


            {/* Welcome Section */}
            <div className="dashboard-welcome mb-4">
                <div className="welcome-content">
                    <span className="welcome-label">
                        YOUR DASHBOARD
                    </span>

                    <h3>
                        Welcome back, {user?.name}!
                    </h3>

                    <p>
                        {role === "admin"
                            ? "Manage your restaurant, monitor users and keep everything organized from one place."
                            : "Explore restaurant menus and manage your account from one place."
                        }
                    </p>

                    <span className="welcome-role">
                        <i className="bi bi-person-badge me-2"></i>
                        {role?.toUpperCase()} ACCOUNT
                    </span>
                </div>

                <div className="welcome-icon">
                    <i className="bi bi-speedometer2"></i>
                </div>
            </div>


            {/* API Error */}
            {error && (
                <div className="alert alert-danger dashboard-alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                </div>
            )}


            {/* Statistics */}
            <div className="row g-4 dashboard-stats">

                {/* Total Menus */}
                <div className="col-xl-4 col-md-6 col-12">
                    <div
                        className="dashboard-stat-card"
                        onClick={() => navigate("/menus")}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => handleCardKeyDown(e, "/menus")}
                        aria-label="Open Menus Management"
                    >
                        <div className="stat-icon stat-icon-green">
                            <i className="bi bi-list-ul"></i>
                        </div>

                        <div className="stat-details">
                            <span>Total Menus</span>

                            <h3>
                                {loading ? "..." : totalMenus}
                            </h3>

                            <small>Available restaurant menus</small>
                        </div>

                        <i className="bi bi-arrow-up-right stat-arrow"></i>
                    </div>
                </div>


                {/* Total Users */}
                {role === "admin" && (
                    <div className="col-xl-4 col-md-6 col-12">
                        <div
                            className="dashboard-stat-card"
                            onClick={() => navigate("/users")}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => handleCardKeyDown(e, "/users")}
                            aria-label="Open Users Management"
                        >
                            <div className="stat-icon stat-icon-blue">
                                <i className="bi bi-people"></i>
                            </div>

                            <div className="stat-details">
                                <span>Total Users</span>

                                <h3>
                                    {loading ? "..." : totalUsers}
                                </h3>

                                <small>Registered system users</small>
                            </div>

                            <i className="bi bi-arrow-up-right stat-arrow"></i>
                        </div>
                    </div>
                )}


                {/* Account Role */}
                <div className="col-xl-4 col-md-6 col-12">
                    <div className="dashboard-stat-card">
                        <div className="stat-icon stat-icon-orange">
                            <i className="bi bi-person-circle"></i>
                        </div>

                        <div className="stat-details">
                            <span>Account Role</span>

                            <h3 className="role-value">
                                {role?.toUpperCase()}
                            </h3>

                            <small>Your current access level</small>
                        </div>

                        <i className="bi bi-shield-check stat-arrow"></i>
                    </div>
                </div>

            </div>


            {/* Recent Activity */}
            <div className="dashboard-activity mt-4">

                <div className="activity-header">
                    <div>
                        <h5>Recent Activity</h5>
                        <p>Your account overview</p>
                    </div>

                    <div className="activity-header-icon">
                        <i className="bi bi-clock-history"></i>
                    </div>
                </div>

                <div className="activity-list">

                    <div className="activity-item">
                        <div className="activity-icon activity-green">
                            <i className="bi bi-check-circle"></i>
                        </div>

                        <div>
                            <h6>Login Successful</h6>
                            <p>You logged into your account.</p>
                        </div>
                    </div>

                    <div className="activity-item">
                        <div className="activity-icon activity-blue">
                            <i className="bi bi-person"></i>
                        </div>

                        <div>
                            <h6>Account Information</h6>
                            <p>Your account information is available.</p>
                        </div>
                    </div>

                    <div className="activity-item">
                        <div className="activity-icon activity-orange">
                            <i className="bi bi-list-ul"></i>
                        </div>

                        <div>
                            <h6>Restaurant Menus</h6>
                            <p>Restaurant menus are available.</p>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;
