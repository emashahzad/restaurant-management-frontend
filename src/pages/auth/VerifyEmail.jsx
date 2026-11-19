
import { Link, useSearchParams } from "react-router-dom";

function VerifyEmail() {

    const [searchParams] = useSearchParams();

    const status = searchParams.get("status");

    const isVerified = status === "success";

    return (
        <div className="login-page">

            <div className="login-card">

                {/* Header */}
                <div className="login-header">

                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="mb-2 fw-semibold">
                            {isVerified
                                ? "Email Verified!"
                                : "Verification Failed"
                            }
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
                        {isVerified
                            ? "Your email address has been verified successfully."
                            : "We could not verify your email address."
                        }
                    </p>

                </div>

                <div className="login-form">

                    {/* Verification Icon */}
                    <div className="text-center mb-4">

                        <i
                            className={`bi ${
                                isVerified
                                    ? "bi-check-circle-fill text-success"
                                    : "bi-exclamation-circle-fill text-danger"
                            }`}
                            style={{ fontSize: "55px" }}
                        ></i>

                    </div>

                    {/* Status Message */}
                    {isVerified ? (

                        <div className="alert alert-success py-3 small text-center">
                            <i className="bi bi-check-circle me-2"></i>
                            Your account is now active. You can log in
                            using your email and password.
                        </div>

                    ) : (

                        <div className="alert alert-danger py-3 small text-center">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            The verification link may be invalid or expired.
                            Please request a new verification email.
                        </div>

                    )}

                    {/* Action Button */}
                    <div className="d-grid">

                        {isVerified ? (

                            <Link
                                to="/login"
                                className="btn btn-primary py-2 text-decoration-none"
                            >
                                Go to Login
                            </Link>

                        ) : (

                            <Link
                                to="/verify-email"
                                className="btn btn-primary py-2 text-decoration-none"
                            >
                                Resend Verification Email
                            </Link>

                        )}

                    </div>


                </div>

            </div>

        </div>
    );
}

export default VerifyEmail;
