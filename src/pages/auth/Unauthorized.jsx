
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Unauthorized() {

    const navigate = useNavigate();
    const { role } = useAuth();

    return (
        <div className="login-page">

            <div className="login-card text-center">

                {/* Header */}
                <div className="login-header">

                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="mb-2 fw-semibold">
                            Access Denied
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
                        You don't have permission to access this page.
                    </p>

                </div>

                {/* Error Content */}
                <div className="login-form">

                    <div className="mb-3">

                        <div
                            className="mx-auto d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                                width: "100px",
                                height: "100px",
                                backgroundColor: "#fff0f0",
                                color: "#dc3545"
                            }}
                        >
                            <i className="bi bi-shield-lock-fill fs-1"></i>
                        </div>

                    </div>

                    <h1 className="display-3 fw-bold text-danger mb-2">
                        403
                    </h1>

                    <h5 className="fw-semibold mb-2">
                        Access Forbidden
                    </h5>

                    <p className="text-muted small mb-3">
                        Your current role does not allow you to view this page.
                    </p>

                    {/* Current Role */}
                    <div className="alert alert-light border mb-4">

                        <i className="bi bi-person-badge me-2"></i>

                        Current Role:{" "}
                        <strong>
                            {role || "Unknown"}
                        </strong>

                    </div>

                    {/* Back Button */}
                    <div className="d-grid">

                        <button
                            type="button"
                            className="btn btn-primary py-2"
                            onClick={() =>
                                navigate("/dashboard", { replace: true })
                            }
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Back to Dashboard
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Unauthorized;
