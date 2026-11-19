
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/login", {
                email,
                password
            });

            login(response.data.user, response.data.token);
            navigate("/dashboard");
            console.log("Email User Data:", response.data.user);
            console.log("Email User Roles:", response.data.user.roles);

        } catch (error) {
            setError(
                error.response?.data?.message || "Login failed!"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                {/* Header */}
                <div className="login-header">

                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="mb-2 fw-semibold">
                            Welcome Back
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
                        Login to your account to continue your journey.
                    </p>

                </div>

                {/* Form */}
                <form onSubmit={handleLogin}>

                    <div className="login-form">

                        {/* Email */}
                        <div className="mb-3">

                            <label className="form-label login-label">
                                User ID or Email
                            </label>

                            <div className="input-group">

                                <span className="input-group-text">
                                    <i className="bi bi-person"></i>
                                </span>

                                <input
                                    type="email"
                                    className="form-control login-input"
                                    placeholder="Enter your Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                            </div>

                        </div>

                        {/* Password */}
                        <div className="mb-3">

                            <label className="form-label login-label">
                                Password
                            </label>

                            <div className="input-group">

                                <span className="input-group-text">
                                    <i className="bi bi-lock"></i>
                                </span>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control login-input"
                                    placeholder="Enter your Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    className="input-group-text password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    <i className={`bi ${showPassword
                                            ? "bi-eye-slash"
                                            : "bi-eye"
                                        }`}></i>
                                </button>

                            </div>

                        </div>

                        {/* Remember + Forgot */}
                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <div className="form-check remember-check d-flex align-items-center gap-2">

                                <input
                                    className="form-check-input m-0"
                                    type="checkbox"
                                    id="rememberMe"
                                />

                                <label
                                    className="form-check-label"
                                    htmlFor="rememberMe"
                                >
                                    Remember me
                                </label>

                            </div>

                            <Link
                                to="/forgot-password"
                                className="text-decoration-none small"
                            >
                                Forgot Password?
                            </Link>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="alert alert-danger py-2 small">

                                {error}

                                {error.toLowerCase().includes("verify") ||
                                    error.toLowerCase().includes("verification") ? (
                                    <div className="mt-2">
                                        <Link
                                            to="/verify-email"
                                            className="fw-semibold text-decoration-none"
                                        >
                                            Resend Verification Email
                                        </Link>
                                    </div>
                                ) : null}

                            </div>
                        )}

                        {/* Login Button */}
                        <div className="d-grid">

                            <button
                                type="submit"
                                className="btn btn-primary py-2"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>

                        </div>

                        {/* Divider */}
                        <div className="d-flex align-items-center my-3">

                            <hr className="flex-grow-1" />

                            <span className="px-3 text-muted small">
                                or
                            </span>

                            <hr className="flex-grow-1" />

                        </div>

                        {/* Google Login */}
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={() => {
                                    window.location.href =
                                        "http://127.0.0.1:8000/auth/google/redirect";
                                }}
                                className="btn btn-outline-danger w-100"
                            >
                                <i className="bi bi-google me-2"></i>
                                Continue with Google
                            </button>
                        </div>

                        {/* Facebook Login */}
                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    window.location.href =
                                        "http://127.0.0.1:8000/auth/facebook/redirect";
                                }}
                                className="btn btn-outline-primary w-100"
                            >
                                <i className="bi bi-facebook me-2"></i>
                                Continue with Facebook
                            </button>
                        </div>

                        {/* Register */}
                        <p className="text-center small mb-0 mt-3">

                            Don't have an Account?{" "}

                            <Link
                                to="/register"
                                className="text-decoration-none fw-semibold"
                            >
                                Register
                            </Link>

                        </p>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default Login;
