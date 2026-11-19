
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await api.post("/forgot-password", {
                email: email
            });

            setSuccess(
                "Password reset link has been sent to your email."
            );

            setEmail("");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Something went wrong. Please try again."
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
                            Forgot Password?
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
                        Enter your registered email to receive a password reset link.
                    </p>

                </div>


                {/* Form */}
                <form onSubmit={handleSubmit}>

                    <div className="login-form">

                        {/* Success */}
                        {success && (
                            <div className="alert alert-success py-2 small">
                                <i className="bi bi-check-circle me-2"></i>
                                {success}
                            </div>
                        )}


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
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />

                            </div>

                        </div>


                        {/* Error */}
                        {error && (
                            <div className="alert alert-danger py-2 small">
                                {error}
                            </div>
                        )}


                        {/* Submit Button */}
                        <div className="d-grid">

                            <button
                                type="submit"
                                className="btn btn-primary py-2"
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
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

            </div>

        </div>
    );
}

export default ForgotPassword;
