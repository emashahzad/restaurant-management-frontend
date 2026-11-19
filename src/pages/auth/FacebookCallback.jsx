
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function FacebookCallback() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Prevent duplicate API calls in React StrictMode
    const requestStarted = useRef(false);

    useEffect(() => {

        if (requestStarted.current) return;

        requestStarted.current = true;

        const exchangeCode = async () => {

            const code = searchParams.get("code");

            if (!code) {
                setError("Facebook login code is missing.");
                setLoading(false);
                return;
            }

            try {

                const response = await api.post("/facebook/exchange", {
                    code: code
                });

                const { user, token } = response.data;

                // Save user and Sanctum token
                login(user, token);

                // Redirect to dashboard
                navigate("/dashboard", { replace: true });

            } catch (err) {

                console.error("Facebook Login Error:", err);

                setError(
                    err.response?.data?.message ||
                    "Facebook login failed. Please try again."
                );

                setLoading(false);
            }
        };

        exchangeCode();

    }, [searchParams, login, navigate]);

    return (
        <div className="login-page">

            <div className="login-card text-center">

                {/* Header */}
                <div className="login-header">

                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="mb-2 fw-semibold">
                            Facebook Login
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
                        Securely connecting your Facebook account.
                    </p>

                </div>

                {/* Callback Content */}
                <div className="login-form">

                    {loading && (
                        <>

                            <div className="mb-3">

                                <i
                                    className="bi bi-facebook"
                                    style={{
                                        fontSize: "55px",
                                        color: "#1877F2"
                                    }}
                                ></i>

                            </div>

                            <div className="spinner-border text-primary mb-3"></div>

                            <h5 className="fw-semibold">
                                Completing Facebook Login...
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
                                Facebook Login Failed
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

export default FacebookCallback;
