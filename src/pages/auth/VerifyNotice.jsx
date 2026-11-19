
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function VerifyNotice() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleResend = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await api.post("/email/resend", {
                email,
            });

            setSuccess(response.data.message);

        } catch (error) {
            const validationErrors = error.response?.data?.errors;

            if (validationErrors) {
                setError(
                    Object.values(validationErrors).flat().join(", ")
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    "Unable to send verification email."
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
                            Verify Your Email
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
                        Your account is almost ready!
                    </p>

                </div>

                <div className="login-form">

                    {/* Email Information */}
                    <div className="alert alert-info py-3 small">
                        <i className="bi bi-envelope-check me-2"></i>
                        We have sent a verification link to your email
                        address. Please check your inbox and click the
                        link to activate your account.
                    </div>


                    <form onSubmit={handleResend}>

                        {/* Email Field */}
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
                                    autoComplete="email"
                                    required
                                />

                            </div>

                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-danger py-2 small">
                                <i className="bi bi-exclamation-circle me-2"></i>
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="alert alert-success py-2 small">
                                <i className="bi bi-check-circle me-2"></i>
                                {success}
                            </div>
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
                                        Sending...
                                    </>
                                ) : (
                                    "Resend Verification Email"
                                )}
                            </button>

                        </div>
                        {/* Divider */}
                            <div className="d-flex align-items-center my-3">
                                <hr className="flex-grow-1" />
                                <span className="px-3 text-muted small">or</span>
                                <hr className="flex-grow-1" />
                            </div>

                            {/* Back to Login */}
                            <p className="text-center small mb-0">
                                Back to Login?{" "}
                                <Link
                                    to="/login"
                                    className="text-decoration-none fw-semibold"
                                >
                                    Login
                                </Link>
                            </p>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default VerifyNotice;
