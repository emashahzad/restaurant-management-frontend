
import { useState, useEffect } from "react";
import api from "../../services/api";

function Trash() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [restoringId, setRestoringId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Fetch deleted users
    const fetchTrash = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/users-trash");
            setUsers(response.data.data);
        } catch (error) {
            if (error.response?.status === 401) {
                setError("Authentication required.");
            } else if (error.response?.status === 403) {
                setError("Admin permission required.");
            } else {
                setError("Failed to fetch deleted users.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, []);

    // Restore user
    const handleRestore = async (user) => {
        const confirmRestore = window.confirm(
            `Are you sure you want to restore ${user.name}?`
        );

        if (!confirmRestore) return;

        try {
            setRestoringId(user.id);
            setError("");
            setSuccess("");

            const response = await api.post(
                `/users/${user.id}/restore`
            );

            setUsers((prevUsers) =>
                prevUsers.filter((item) => item.id !== user.id)
            );

            setSuccess(response.data.message);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to restore user."
            );
        } finally {
            setRestoringId(null);
        }
    };

    // Permanently delete user
    const handlePermanentDelete = async (user) => {
        const confirmDelete = window.confirm(
            `WARNING!\n\nAre you sure you want to permanently delete ${user.name}?\n\nThis action cannot be undone.`
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(user.id);
            setError("");
            setSuccess("");

            const response = await api.delete(
                `/users/${user.id}/force`
            );

            setUsers((prevUsers) =>
                prevUsers.filter((item) => item.id !== user.id)
            );

            setSuccess(response.data.message);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to permanently delete user."
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="container-fluid users-page">

            <div className="users-heading">
                <div className="users-title">
                    <div className="users-title-icon trash-title-icon">
                        <i className="bi bi-trash3-fill"></i>
                    </div>

                    <div>
                        <h2>Deleted Users</h2>
                        <p>View, restore, or permanently delete user accounts.</p>
                    </div>
                </div>

                <div className="trash-count">
                    <i className="bi bi-archive"></i>
                    {users.length} Deleted
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="users-message users-error">
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="users-message users-success">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>{success}</span>
                </div>
            )}

            <div className="users-table-card">

                <div className="users-table-header">
                    <div>
                        <h5>
                            Users Trash
                        </h5>

                        <p>Restore accounts or permanently remove them.</p>
                    </div>

                    <div className="trash-info">
                        <i className="bi bi-info-circle"></i>
                        Restore & Permanent Delete
                    </div>
                </div>

                <div className="users-table-wrapper">

                    {loading ? (

                        <div className="users-loading">
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>

                            <p>Loading deleted users...</p>
                        </div>

                    ) : (

                        <table className="users-table trash-table menus-trash-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email Address</th>
                                    <th>Deleted At</th>
                                    <th className="trash-action-column">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.length > 0 ? (

                                    users.map((user) => (
                                        <tr key={user.id}>

                                            <td>
                                                <span className="users-id">
                                                    #{user.id}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="users-name-cell">
                                                    <div className="users-avatar trash-avatar">
                                                        <i className="bi bi-person-fill"></i>
                                                    </div>

                                                    <span>{user.name}</span>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="users-email">
                                                    {user.email}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="deleted-date">
                                                    <i className="bi bi-calendar-x"></i>
                                                    <span>
                                                        {user.deleted_at || "N/A"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="d-flex gap-2">

                                                    {/* Restore */}
                                                    <button
                                                        type="button"
                                                        className="trash-restore-btn"
                                                        onClick={() => handleRestore(user)}
                                                        disabled={
                                                            restoringId === user.id ||
                                                            deletingId === user.id
                                                        }
                                                    >
                                                        <i className="bi bi-arrow-counterclockwise"></i>

                                                        <span>
                                                            {restoringId === user.id
                                                                ? "Restoring..."
                                                                : "Restore"}
                                                        </span>
                                                    </button>

                                                    {/* Permanent Delete */}
                                                    <button
                                                        type="button"
                                                        className="users-delete-btn"
                                                        onClick={() => handlePermanentDelete(user)}
                                                        disabled={
                                                            deletingId === user.id ||
                                                            restoringId === user.id
                                                        }
                                                    >
                                                        <i className="bi bi-trash3 me-1"></i>

                                                        {deletingId === user.id
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))

                                ) : (

                                    <tr>
                                        <td colSpan="5">

                                            <div className="trash-empty">
                                                <div className="trash-empty-icon">
                                                    <i className="bi bi-trash3"></i>
                                                </div>

                                                <h6>Trash is Empty</h6>

                                                <p>
                                                    There are currently no deleted users.
                                                </p>
                                            </div>

                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>

                    )}

                </div>
            </div>

        </div>
    );
}

export default Trash;
