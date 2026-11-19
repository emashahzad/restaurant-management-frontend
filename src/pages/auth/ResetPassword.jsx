
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";

function ResetPassword() {

    const [searchParams] = useSearchParams();

    // Get token and email from URL
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!token || !email) {
            setError("Invalid or missing password reset link.");
            return;
        }

        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await api.post("/reset-password", {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            setSuccess("Password reset successfully!");

            setPassword("");
            setPasswordConfirmation("");

        } catch (err) {
            const errors = err.response?.data?.errors;

            if (errors) {
                setError(Object.values(errors).flat().join(" "));
            } else {
                setError(
                    err.response?.data?.message ||
                    "Unable to reset password. Please try again."
                );
            }
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
                            Reset Password
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
                        Create a new password for your account.
                    </p>

                </div>

                {/* Invalid Link */}
                {!token || !email ? (

                    <div className="login-form">

                        <div className="alert alert-danger py-2 small">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            Invalid or incomplete password reset link.
                        </div>

                        <div className="d-grid">
                            <Link
                                to="/forgot-password"
                                className="btn btn-primary py-2"
                            >
                                Request New Reset Link
                            </Link>
                        </div>

                        <div className="d-flex align-items-center my-3">
                            <hr className="flex-grow-1" />
                            <span className="px-3 text-muted small">or</span>
                            <hr className="flex-grow-1" />
                        </div>

                        <p className="text-center small mb-0">
                            <Link
                                to="/login"
                                className="text-decoration-none fw-semibold"
                            >
                                Back to Login
                            </Link>
                        </p>

                    </div>

                ) : (

                    <form onSubmit={handleSubmit}>

                        <div className="login-form">

                            {/* Success Message */}
                            {success && (
                                <div className="alert alert-success py-2 small">
                                    <i className="bi bi-check-circle me-2"></i>
                                    {success}
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="alert alert-danger py-2 small">
                                    <i className="bi bi-exclamation-circle me-2"></i>
                                    {error}
                                </div>
                            )}

                            {/* New Password */}
                            {!success && (
                                <>
                                    <div className="mb-3">

                                        <label className="form-label login-label">
                                            New Password
                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text">
                                                <i className="bi bi-lock"></i>
                                            </span>

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control login-input"
                                                placeholder="Enter new password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                minLength={8}
                                                autoComplete="new-password"
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="input-group-text"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
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
                                                <i className="bi bi-lock-fill"></i>
                                            </span>

                                            <input
                                                type={showConfirmation ? "text" : "password"}
                                                className="form-control login-input"
                                                placeholder="Confirm new password"
                                                value={passwordConfirmation}
                                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                                minLength={8}
                                                autoComplete="new-password"
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="input-group-text"
                                                onClick={() => setShowConfirmation(!showConfirmation)}
                                                aria-label={showConfirmation ? "Hide password" : "Show password"}
                                            >
                                                <i className={`bi ${showConfirmation ? "bi-eye-slash" : "bi-eye"}`}></i>
                                            </button>

                                        </div>

                                    </div>

                                    {/* Password Match Indicator */}
                                    {passwordConfirmation && (
                                        <p className={`small mb-3 ${
                                            password === passwordConfirmation
                                                ? "text-success"
                                                : "text-danger"
                                        }`}>
                                            <i className={`bi ${
                                                password === passwordConfirmation
                                                    ? "bi-check-circle"
                                                    : "bi-exclamation-circle"
                                            } me-2`}></i>

                                            {password === passwordConfirmation
                                                ? "Passwords match"
                                                : "Passwords do not match"
                                            }
                                        </p>
                                    )}

                                    {/* Submit Button */}
                                    <div className="d-grid">

                                        <button
                                            type="submit"
                                            className="btn btn-primary py-2"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Resetting...
                                                </>
                                            ) : (
                                                "Reset Password"
                                            )}
                                        </button>

                                    </div>
                                </>
                            )}

                            {/* Success Login Button */}
                            {success && (
                                <div className="d-grid">
                                    <Link
                                        to="/login"
                                        className="btn btn-primary py-2"
                                    >
                                        Go to Login
                                    </Link>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="d-flex align-items-center my-3">
                                <hr className="flex-grow-1" />
                                <span className="px-3 text-muted small">or</span>
                                <hr className="flex-grow-1" />
                            </div>

                            {/* Back to Login */}
                            <p className="text-center small mb-0">
                                Remember your password?{" "}
                                <Link
                                    to="/login"
                                    className="text-decoration-none fw-semibold"
                                >
                                    Login
                                </Link>
                            </p>

                        </div>

                    </form>
                )}

            </div>

        </div>
    );
}

export default ResetPassword;
