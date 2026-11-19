
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Menus() {
    const { role } = useAuth();

    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    // Messages and loading states
    const [formError, setFormError] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Fetch Menus
    const fetchMenus = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/menus");

            setMenus(response.data.menus || []);

        } catch (error) {
            console.error("Menus API Error:", error);

            if (error.response?.status === 401) {
                setError("Authentication required. Please login.");
            } else if (error.response?.status === 403) {
                setError("You don't have permission to view menus.");
            } else {
                setError("Something went wrong while fetching menus.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    // Reset Form
    const resetForm = () => {
        setName("");
        setDescription("");
        setPrice("");
        setFormError("");
        setShowAddForm(false);
        setEditingMenu(null);
    };

    // Add Menu
    const handleAddMenu = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setFormError("");
            setSuccess("");

            const response = await api.post("/menus", {
                name,
                description,
                price
            });

            setSuccess(response.data.message || "Menu added successfully.");

            resetForm();
            await fetchMenus();

        } catch (error) {
            console.error("Add Menu Error:", error);

            if (error.response?.status === 401) {
                setFormError("Please login first.");
            } else if (error.response?.status === 403) {
                setFormError("You don't have permission to add menus.");
            } else if (error.response?.status === 422) {
                setFormError(
                    error.response.data.message || "Please check your input."
                );
            } else {
                setFormError("Something went wrong while adding menu.");
            }
        } finally {
            setSaving(false);
        }
    };

    // Edit Menu
    const handleEdit = (menu) => {
        setEditingMenu(menu);

        setName(menu.name);
        setDescription(menu.description || "");
        setPrice(menu.price);

        setShowAddForm(false);
        setFormError("");
        setSuccess("");
    };

    // Update Menu
    const handleUpdateMenu = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setFormError("");
            setSuccess("");

            const response = await api.put(`/menus/${editingMenu.id}`, {
                name,
                description,
                price
            });

            setSuccess(response.data.message || "Menu updated successfully.");

            resetForm();
            await fetchMenus();

        } catch (error) {
            console.error("Update Menu Error:", error);

            if (error.response?.status === 401) {
                setFormError("Please login first.");
            } else if (error.response?.status === 403) {
                setFormError("You don't have permission to update menus.");
            } else if (error.response?.status === 422) {
                setFormError(
                    error.response.data.message || "Please check your input."
                );
            } else {
                setFormError("Something went wrong while updating menu.");
            }
        } finally {
            setSaving(false);
        }
    };

    // Delete Menu
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this menu?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setDeletingId(id);
            setError("");
            setSuccess("");

            const response = await api.delete(`/menus/${id}`);

            setSuccess(response.data.message || "Menu deleted successfully.");

            await fetchMenus();

        } catch (error) {
            console.error("Delete Menu Error:", error);

            if (error.response?.status === 401) {
                setError("Please login first.");
            } else if (error.response?.status === 403) {
                setError("You don't have permission to delete menus.");
            } else if (error.response?.status === 404) {
                setError("Menu not found.");
            } else {
                setError("Something went wrong while deleting menu.");
            }
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="container-fluid menus-page">

            {/* Page Heading */}
            <div className="menus-heading">

                <div>
                    <div className="menus-title-wrapper">
                        <span className="menus-title-icon">
                            <i className="bi bi-journal-richtext"></i>
                        </span>

                        <div>
                            <h3 className="menus-title">Menus Management</h3>
                            <p className="menus-subtitle">
                                Manage and organize your restaurant menus
                            </p>
                        </div>
                    </div>
                </div>

                {role === "admin" && (
                    <button
                        className="menus-add-btn"
                        onClick={() => {
                            resetForm();
                            setShowAddForm(true);
                            setSuccess("");
                        }}
                    >
                        <i className="bi bi-plus-lg"></i>
                        Add Menu
                    </button>
                )}

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

            {/* Add/Edit Form */}
            {(showAddForm || editingMenu) && (
                <div className="menus-form-card">

                    <div className="menus-form-header">
                        <div className="menus-form-heading">
                            <span className="menus-form-icon">
                                <i className={`bi ${editingMenu ? "bi-pencil-square" : "bi-plus-circle"}`}></i>
                            </span>

                            <div>
                                <h5>
                                    {editingMenu ? "Edit Menu" : "Add New Menu"}
                                </h5>
                                <p>
                                    {editingMenu
                                        ? "Update the menu information below"
                                        : "Enter the details to create a new menu"}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="menus-close-btn"
                            onClick={resetForm}
                            disabled={saving}
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <div className="menus-form-body">

                        {formError && (
                            <div className="users-message users-error">
                                <i className="bi bi-exclamation-circle-fill"></i>
                                <span>{formError}</span>
                            </div>
                        )}

                        <form
                            onSubmit={
                                editingMenu
                                    ? handleUpdateMenu
                                    : handleAddMenu
                            }
                        >

                            <div className="row">

                                {/* Name */}
                                <div className="col-md-6 mb-3">
                                    <label className="menus-label">
                                        Menu Name <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        className="menus-input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter menu name"
                                        required
                                        maxLength="255"
                                    />
                                </div>

                                {/* Price */}
                                <div className="col-md-6 mb-3">
                                    <label className="menus-label">
                                        Price <span>*</span>
                                    </label>

                                    <div className="menus-price-input">
                                        <span>Rs.</span>
                                        <input
                                            type="number"
                                            className="menus-input"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="Enter price"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="col-12 mb-3">
                                    <label className="menus-label">
                                        Description
                                        <span className="menus-optional"> (Optional)</span>
                                    </label>

                                    <textarea
                                        className="menus-input menus-textarea"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter menu description"
                                        rows="3"
                                    ></textarea>
                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="menus-form-footer">

                                <button
                                    type="button"
                                    className="users-secondary-btn"
                                    onClick={resetForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="users-primary-btn"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className={`bi ${editingMenu ? "bi-check-lg" : "bi-plus-lg"}`}></i>
                                            {editingMenu ? "Update Menu" : "Save Menu"}
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* Menus Table */}
            <div className="users-table-card">

                <div className="users-table-header">
                    <div>
                        <h5>All Menus</h5>
                        <p>View and manage available restaurant menus</p>
                    </div>

                    <span className="menus-count">
                        <i className="bi bi-collection"></i>
                        {menus.length} Menus
                    </span>
                </div>

                <div className="users-table-wrapper">

                    {loading ? (
                        <div className="users-loading">
                            <div className="spinner-border"></div>
                            <p>Loading menus...</p>
                        </div>
                    ) : (
                        <table className="users-table menus-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Menu Name</th>
                                    <th>Description</th>
                                    <th>Price</th>

                                    {role === "admin" && (
                                        <th className="menus-action-column">Actions</th>
                                    )}
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
                                                    <span className="menus-item-icon">
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

                                            {role === "admin" && (
                                                <td>
                                                    <div className="users-action-buttons">

                                                        <button
                                                            className="users-edit-btn"
                                                            onClick={() => handleEdit(menu)}
                                                            disabled={deletingId === menu.id}
                                                            title="Edit menu"
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="users-delete-btn"
                                                            onClick={() => handleDelete(menu.id)}
                                                            disabled={deletingId === menu.id}
                                                            title="Delete menu"
                                                        >
                                                            <i className="bi bi-trash3"></i>
                                                            {deletingId === menu.id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>

                                                    </div>
                                                </td>
                                            )}

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={role === "admin" ? 5 : 4}
                                            className="menus-empty-cell"
                                        >
                                            <div className="menus-empty">
                                                <span className="menus-empty-icon">
                                                    <i className="bi bi-journal-x"></i>
                                                </span>

                                                <h6>No Menus Found</h6>
                                                <p>
                                                    There are currently no menus available.
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

export default Menus;
