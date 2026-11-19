
import { useState, useEffect } from "react";
import api from "../../services/api";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Edit form states
    const [editUser, setEditUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "user",
        password: ""
    });

    const [saving, setSaving] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState(null);

    const [showAddForm, setShowAddForm] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");

    const [formError, setFormError] = useState("");

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/users");

            setUsers(response.data.User);
        } catch (error) {
            if (error.response?.status === 401) {
                setError("Authentication required. Please login.");
            } else if (error.response?.status === 403) {
                setError("Admin permission required.");
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const resetAddForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setRole("user");
        setFormError("");
        setShowAddForm(false);
    };

    // Open edit form
    const handleEdit = (user) => {
        setEditUser(user);

        setFormData({
            name: user.name,
            email: user.email,
            role: user.roles?.[0]?.name || "user",
            password: ""
        });

        setError("");
        setSuccess("");
    };

    // Input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Add user
    const handleAddUser = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setFormError("");
            setError("");
            setSuccess("");

            const response = await api.post("/users", {
                name,
                email,
                password,
                role
            });

            setSuccess(response.data.message || "User created successfully.");

            resetAddForm();

            await fetchUsers();

        } catch (error) {
            console.error("Add User Error:", error);

            if (error.response?.status === 401) {
                setFormError("Authentication required.");
            } else if (error.response?.status === 403) {
                setFormError("Admin permission required.");
            } else if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors || {};

                setFormError(
                    Object.values(validationErrors)
                        .flat()
                        .join(" ")
                );
            } else {
                setFormError(
                    error.response?.data?.message ||
                    "Failed to create user."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    // Update user
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const data = {
                name: formData.name,
                email: formData.email,
                role: formData.role
            };

            if (formData.password.trim() !== "") {
                data.password = formData.password;
            }

            const response = await api.put(
                `/users/${editUser.id}`,
                data
            );

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === editUser.id
                        ? response.data.User
                        : user
                )
            );

            setEditUser(null);
            setSuccess(response.data.message);

        } catch (error) {
            if (error.response?.status === 401) {
                setError("Authentication required.");
            } else if (error.response?.status === 403) {
                setError("You don't have permission to update users.");
            } else if (error.response?.status === 422) {
                setError(
                    Object.values(error.response.data.errors || {})
                        .flat()
                        .join(" ")
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    "Failed to update user."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    // Delete user
    const handleDelete = async (user) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${user.name}?`
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setError("");
            setSuccess("");
            setDeletingUserId(user.id);

            const response = await api.delete(`/users/${user.id}`);

            setUsers((prevUsers) =>
                prevUsers.filter((item) => item.id !== user.id)
            );

            setSuccess(response.data.message);

        } catch (error) {
            if (error.response?.status === 401) {
                setError("Authentication required.");
            } else if (error.response?.status === 403) {
                setError(
                    error.response.data.message ||
                    "You don't have permission to delete this user."
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    "Failed to delete user."
                );
            }
        } finally {
            setDeletingUserId(null);
        }
    };

    return (
        <div className="container-fluid users-page">

            {/* Page Heading */}
            <div className="users-heading">

                <div>
                    <div className="users-title">
                        <div className="users-title-icon">
                            <i className="bi bi-people-fill"></i>
                        </div>

                        <div>
                            <h2>Users Management</h2>
                            <p>Manage system users, roles and account details.</p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className="users-add-btn"
                    onClick={() => {
                        setShowAddForm(true);
                        setFormError("");
                        setSuccess("");
                    }}
                >
                    <i className="bi bi-plus-lg"></i>
                    <span>Add User</span>
                </button>

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

            {/* Edit User Form */}
            {editUser && (
                <div className="users-form-card">

                    <div className="users-form-header">
                        <div className="users-form-heading">
                            <div className="users-form-icon">
                                <i className="bi bi-pencil-square"></i>
                            </div>

                            <div>
                                <h5>Edit User</h5>
                                <p>Update user account information</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="users-close-btn"
                            onClick={() => setEditUser(null)}
                            aria-label="Close edit form"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <form onSubmit={handleUpdate}>

                        <div className="users-form-body">

                            <div className="row g-3">

                                <div className="col-md-6">
                                    <label className="users-label">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control users-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="users-label">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control users-input"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="users-label">
                                        User Role
                                    </label>

                                    <select
                                        name="role"
                                        className="form-select users-input"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="users-label">
                                        New Password
                                        <span className="users-optional">Optional</span>
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control users-input"
                                        value={formData.password}
                                        onChange={handleChange}
                                        minLength="8"
                                        placeholder="Leave blank to keep current password"
                                    />
                                </div>

                            </div>

                        </div>

                        <div className="users-form-footer">

                            <button
                                type="submit"
                                className="users-primary-btn"
                                disabled={saving}
                            >
                                <i className="bi bi-check-lg"></i>
                                {saving ? "Updating..." : "Update User"}
                            </button>

                            <button
                                type="button"
                                className="users-secondary-btn"
                                onClick={() => setEditUser(null)}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>
                </div>
            )}

            {/* Add User Form */}
            {showAddForm && (
                <div className="users-form-card">

                    <div className="users-form-header">
                        <div className="users-form-heading">
                            <div className="users-form-icon">
                                <i className="bi bi-person-plus-fill"></i>
                            </div>

                            <div>
                                <h5>Add New User</h5>
                                <p>Create a new system account</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="users-close-btn"
                            onClick={resetAddForm}
                            aria-label="Close add form"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <form onSubmit={handleAddUser}>

                        <div className="users-form-body">

                            {formError && (
                                <div className="users-message users-error">
                                    <i className="bi bi-exclamation-circle-fill"></i>
                                    <span>{formError}</span>
                                </div>
                            )}

                            <div className="row g-3">

                                <div className="col-md-6">
                                    <label className="users-label">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control users-input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter user name"
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="users-label">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control users-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter user email"
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="users-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control users-input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        minLength="8"
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="users-label">
                                        User Role
                                    </label>

                                    <select
                                        className="form-select users-input"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                            </div>

                        </div>

                        <div className="users-form-footer">

                            <button
                                type="submit"
                                className="users-primary-btn"
                                disabled={saving}
                            >
                                <i className="bi bi-check-lg"></i>
                                {saving ? "Saving..." : "Save User"}
                            </button>

                            <button
                                type="button"
                                className="users-secondary-btn"
                                onClick={resetAddForm}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>
                </div>
            )}

            {/* Users Table Card */}
            <div className="users-table-card">

                <div className="users-table-header">
                    <div>
                        <h5>All Users</h5>
                        <p>View and manage registered users</p>
                    </div>

                    <div className="users-count">
                        <i className="bi bi-people"></i>
                        {users.length} Users
                    </div>
                </div>

                <div className="users-table-wrapper">

                    {loading ? (
                        <div className="users-loading">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p>Loading users...</p>
                        </div>
                    ) : (

                        <table className="users-table menus-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email Address</th>
                                    <th>Role</th>
                                    <th className="users-actions-column">Actions</th>
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
                                                    <div className="users-avatar">
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
                                                {user.roles?.length > 0 ? (
                                                    user.roles.map((role) => (
                                                        <span
                                                            key={role.name}
                                                            className={`users-role-badge ${
                                                                role.name === "admin"
                                                                    ? "users-admin-role"
                                                                    : "users-user-role"
                                                            }`}
                                                        >
                                                            {role.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="users-no-role">
                                                        No Role
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <div className="users-action-buttons">

                                                    <button
                                                        type="button"
                                                        className="users-edit-btn"
                                                        onClick={() => handleEdit(user)}
                                                        title="Edit user"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                        <span>Edit</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="users-delete-btn"
                                                        onClick={() => handleDelete(user)}
                                                        disabled={deletingUserId === user.id}
                                                        title="Delete user"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                        <span>
                                                            {deletingUserId === user.id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </span>
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))

                                ) : (
                                    <tr>
                                        <td colSpan="5">
                                            <div className="users-empty">
                                                <div className="users-empty-icon">
                                                    <i className="bi bi-people"></i>
                                                </div>

                                                <h6>No Users Found</h6>
                                                <p>There are currently no users to display.</p>
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

export default Users;
