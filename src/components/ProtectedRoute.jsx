
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {

    const { isAuthenticated, role } = useAuth();

    // User must be logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If specific roles are required, check user's role
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default ProtectedRoute;
