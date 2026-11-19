
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Menus from "./pages/menus/Menus";
import Users from "./pages/users/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Trash from "./pages/users/trash";
import MenuTrash from "./pages/menus/MenuTrash";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyNotice from "./pages/auth/VerifyNotice";
import VerifyEmail from "./pages/auth/VerifyEmail";
import GoogleCallback from "./pages/auth/GoogleCallback";
import FacebookCallback from "./pages/auth/FacebookCallback";
import Unauthorized from "./pages/auth/Unauthorized";

import "./App.css";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyNotice />} />
                <Route path="/email-verified" element={<VerifyEmail />} />
                <Route path="/google-callback" element={<GoogleCallback />} />
                <Route path="/facebook-callback" element={<FacebookCallback />} />

                {/* Unauthorized Page */}
                <Route
                    path="/unauthorized"
                    element={
                        <ProtectedRoute>
                            <Unauthorized />
                        </ProtectedRoute>
                    }
                />

                {/* Authenticated Routes */}
                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* Common Routes: Admin + User */}
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/menus"
                        element={<Menus />}
                    />

                    {/* Admin Only Routes */}
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <Users />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/users-trash"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <Trash />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/menus-trash"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <MenuTrash />
                            </ProtectedRoute>
                        }
                    />

                </Route>

                {/* Unknown Routes */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
