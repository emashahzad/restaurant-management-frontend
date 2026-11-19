
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await api.post("/register", {
                name,
                email,
                password,
                password_confirmation,
            });

            setSuccess(
                response.data.message ||
                "Account created successfully! Please verify your email before logging in."
            );

            // Clear form after successful registration
            setName("");
            setEmail("");
            setPassword("");
            setPasswordConfirmation("");

        } catch (error) {
            const validationErrors = error.response?.data?.errors;

            if (validationErrors) {
                const messages = Object.values(validationErrors).flat();
                setError(messages.join(", "));
            } else {
                setError(
                    error.response?.data?.message || "Registration failed!"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card register-card">

                {/* Header */}
                <div className="login-header">

                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="mb-2 fw-semibold">
                            Create Account
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
                        Register your account to get started.
                    </p>

                </div>

                {/* Form */}
                <form onSubmit={handleRegister}>

                    <div className="login-form">

                        {/* Name */}
                        <div className="mb-3">

                            <label className="form-label login-label">
                                Full Name
                            </label>

                            <div className="input-group">

                                <span className="input-group-text">
                                    <i className="bi bi-person"></i>
                                </span>

                                <input
                                    type="text"
                                    className="form-control login-input"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />

                            </div>

                        </div>

                        {/* Email */}
                        <div className="mb-3">

                            <label className="form-label login-label">
                                Email Address
                            </label>

                            <div className="input-group">

                                <span className="input-group-text">
                                    <i className="bi bi-envelope"></i>
                                </span>

                                <input
                                    type="email"
                                    className="form-control login-input"
                                    placeholder="Enter your email"
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
                                    placeholder="Enter your password"
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
                                    <i className={`bi ${
                                        showPassword ? "bi-eye-slash" : "bi-eye"
                                    }`}></i>
                                </button>

                            </div>

                        </div>

                        {/* Confirm Password */}
                        <div className="mb-3">

                            <label className="form-label login-label">
                                Confirm Password
                            </label>

                            <div className="input-group">

                                <span className="input-group-text">
                                    <i className="bi bi-shield-lock"></i>
                                </span>

                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="form-control login-input"
                                    placeholder="Confirm your password"
                                    value={password_confirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    className="input-group-text password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label="Toggle confirm password visibility"
                                >
                                    <i className={`bi ${
                                        showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                                    }`}></i>
                                </button>

                            </div>

                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-danger py-2 small">
                                {error}
                            </div>
                        )}

                        {/* Verification Success Message */}
                        {success && (
                            <div className="alert alert-success py-3 small">
                                <div className="fw-semibold mb-1">
                                    <i className="bi bi-envelope-check me-2"></i>
                                    Registration Successful!
                                </div>

                                {success}

                                <div className="mt-2">
                                    Please check your inbox and click the
                                    verification link before logging in.
                                </div>
                            </div>
                        )}

                        {/* Register Button */}
                        <div className="d-grid">

                            <button
                                type="submit"
                                className="btn btn-primary py-2"
                                disabled={loading}
                            >
                                {loading ? "Registering..." : "Register"}
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

                        {/* Login Link */}
                        <p className="text-center small mb-0">

                            Already have an Account?{" "}

                            <Link
                                to="/login"
                                className="text-decoration-none fw-semibold"
                            >
                                Login
                            </Link>

                        </p>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default Register;
