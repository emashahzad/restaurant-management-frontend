
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function GoogleCallback() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { login } = useAuth();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const processed = useRef(false);

    useEffect(() => {

        if (processed.current) return;

        processed.current = true;

        const exchangeCode = async () => {

            try {

                // Check Google OAuth error
                const googleError = searchParams.get("error");

                if (googleError) {
                    throw new Error(googleError);
                }

                // Get temporary login code
                const code = searchParams.get("code");

                if (!code) {
                    throw new Error("Google login code is missing.");
                }

                // Exchange code for Sanctum token
                const response = await api.post("/google/exchange", {
                    code
                });

                const userData = response.data.user;
                const authToken = response.data.token;

                if (!userData || !authToken) {
                    throw new Error("Invalid login response from server.");
                }

                // Validate role
                const userRole = userData.roles?.[0];

                if (!userRole) {
                    throw new Error("User role not found.");
                }

                console.log("Google Login Successful");
                console.log("Google User:", userData);
                console.log("Google Role:", userRole);

                // Save user and token
                login(userData, authToken);

                // Navigate according to role
                navigate("/dashboard", { replace: true });

            } catch (error) {

                console.error("Google Login Error:", error);

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Google login failed."
                );

                setLoading(false);
            }
        };

        exchangeCode();

    }, [login, navigate, searchParams]);

    return (
        <div className="login-page">

            <div className="login-card text-center">

                {/* Header */}
                <div className="login-header">

                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="mb-2 fw-semibold">
                            Google Login
                        </h5>

                        <button
                            type="button"
                            className="three-dots"
                            aria-label="More options"
                        >
                            &#8943;
                        </button>

                    </div>

                    <p className="login-subtitle">
                        Securely connecting your Google account.
                    </p>

                </div>

                {/* Callback Content */}
                <div className="login-form">

                    {loading && !error && (
                        <>

                            <div className="mb-3">

                                <i
                                    className="bi bi-google"
                                    style={{
                                        fontSize: "55px",
                                        color: "#DB4437"
                                    }}
                                ></i>

                            </div>

                            <div className="spinner-border text-primary mb-3"></div>

                            <h5 className="fw-semibold">
                                Completing Google Login...
                            </h5>

                            <p className="text-muted small mb-0">
                                Please wait while we authenticate your account.
                            </p>

                        </>
                    )}

                    {error && (
                        <>

                            <div className="mb-3">

                                <i
                                    className="bi bi-exclamation-circle-fill text-danger"
                                    style={{ fontSize: "55px" }}
                                ></i>

                            </div>

                            <h5 className="fw-semibold text-danger mb-2">
                                Google Login Failed
                            </h5>

                            <div className="alert alert-danger small">
                                {error}
                            </div>

                            <div className="d-grid">

                                <button
                                    type="button"
                                    className="btn btn-primary py-2"
                                    onClick={() =>
                                        navigate("/login", { replace: true })
                                    }
                                >
                                    <i className="bi bi-arrow-left me-2"></i>
                                    Back to Login
                                </button>

                            </div>

                        </>
                    )}

                </div>

            </div>

        </div>
    );
}

export default GoogleCallback;
