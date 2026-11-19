
import { useState, useEffect } from "react";
import api from "../../services/api";

function MenuTrash() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [restoringId, setRestoringId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Fetch Deleted Menus
    const fetchTrash = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/menus-trash");
            setMenus(response.data.data || []);

        } catch (error) {
            console.error("Trash API Error:", error);

            if (error.response?.status === 401) {
                setError("Please login first.");
            } else if (error.response?.status === 403) {
                setError("You don't have permission to view deleted menus.");
            } else {
                setError("Something went wrong while fetching deleted menus.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, []);

    // Restore Menu
    const handleRestore = async (id) => {
        const confirmRestore = window.confirm(
            "Are you sure you want to restore this menu?"
        );

        if (!confirmRestore) return;

        try {
            setRestoringId(id);
            setError("");
            setSuccess("");

            const response = await api.post(`/menus/${id}/restore`);

            setSuccess(
                response.data.message || "Menu restored successfully."
            );

            await fetchTrash();

        } catch (error) {
            console.error("Restore Menu Error:", error);

            setError(
                error.response?.data?.message ||
                "Something went wrong while restoring menu."
            );
        } finally {
            setRestoringId(null);
        }
    };

    // Permanently Delete Menu
    const handlePermanentDelete = async (menu) => {
        const confirmDelete = window.confirm(
            `WARNING!\n\nAre you sure you want to permanently delete "${menu.name}"?\n\nThis action cannot be undone.`
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(menu.id);
            setError("");
            setSuccess("");

            const response = await api.delete(
                `/menus/${menu.id}/force`
            );

            setSuccess(
                response.data.message ||
                "Menu permanently deleted successfully."
            );

            await fetchTrash();

        } catch (error) {
            console.error("Permanent Delete Menu Error:", error);

            if (error.response?.status === 409) {
                setError(
                    error.response.data.message ||
                    "This menu cannot be permanently deleted because it is linked to existing orders."
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    "Something went wrong while permanently deleting menu."
                );
            }
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="container-fluid menus-page">

            {/* Page Heading */}
            <div className="menus-heading">

                <div className="menus-title-wrapper">

                    <span className="menus-title-icon trash-title-icon">
                        <i className="bi bi-trash3"></i>
                    </span>

                    <div>
                        <h3 className="menus-title">Deleted Menus</h3>
                        <p className="menus-subtitle">
                            View, restore, or permanently delete menus
                        </p>
                    </div>

                </div>

                <span className="trash-count">
                    <i className="bi bi-archive"></i>
                    {menus.length} Deleted Menus
                </span>

            </div>

            {/* Success Message */}
            {success && (
                <div className="users-message users-success">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>{success}</span>

                    <button
                        type="button"
                        onClick={() => setSuccess("")}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="users-message users-error">
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() => setError("")}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            )}

            {/* Trash Table Card */}
            <div className="users-table-card">

                <div className="users-table-header">

                    <div>
                        <h5>Menus Trash</h5>
                        <p>Restore deleted menus or permanently remove them.</p>
                    </div>

                    <span className="trash-info">
                        <i className="bi bi-info-circle"></i>
                        Restore & Permanent Delete
                    </span>

                </div>

                <div className="users-table-wrapper">

                    {loading ? (
                        <div className="users-loading">
                            <div className="spinner-border"></div>
                            <p>Loading deleted menus...</p>
                        </div>
                    ) : (
                        <table className="users-table trash-table menus-trash-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Menu Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Deleted At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {menus.length > 0 ? (
                                    menus.map((menu) => (
                                        <tr key={menu.id}>

                                            <td className="users-id">
                                                #{menu.id}
                                            </td>

                                            <td>
                                                <div className="menus-name-cell">
                                                    <span className="menus-item-icon trash-avatar">
                                                        <i className="bi bi-egg-fried"></i>
                                                    </span>

                                                    <span>{menu.name}</span>
                                                </div>
                                            </td>

                                            <td className="menus-description">
                                                {menu.description || "N/A"}
                                            </td>

                                            <td>
                                                <span className="menus-price-badge">
                                                    Rs. {Number(menu.price).toFixed(2)}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="deleted-date">
                                                    <i className="bi bi-calendar3"></i>

                                                    <span>
                                                        {menu.deleted_at
                                                            ? new Date(menu.deleted_at).toLocaleString()
                                                            : "N/A"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="d-flex gap-2">

                                                    {/* Restore Button */}
                                                    <button
                                                        type="button"
                                                        className="trash-restore-btn"
                                                        onClick={() => handleRestore(menu.id)}
                                                        disabled={
                                                            restoringId === menu.id ||
                                                            deletingId === menu.id
                                                        }
                                                    >
                                                        {restoringId === menu.id ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm"></span>
                                                                Restoring...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-arrow-counterclockwise"></i>
                                                                Restore
                                                            </>
                                                        )}
                                                    </button>

                                                    {/* Permanent Delete Button */}
                                                    <button
                                                        type="button"
                                                        className="users-delete-btn"
                                                        onClick={() => handlePermanentDelete(menu)}
                                                        disabled={
                                                            deletingId === menu.id ||
                                                            restoringId === menu.id
                                                        }
                                                    >
                                                        {deletingId === menu.id ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                                Deleting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-trash3 me-1"></i>
                                                                Delete
                                                            </>
                                                        )}
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="menus-empty-cell">

                                            <div className="trash-empty">
                                                <span className="trash-empty-icon">
                                                    <i className="bi bi-trash3"></i>
                                                </span>

                                                <h6>Trash is Empty</h6>

                                                <p>
                                                    There are currently no deleted menus.
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

export default MenuTrash;
