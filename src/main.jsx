import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/dist/js/adminlte.min.js";

import "./index.css";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";

// AdminLTE responsive layout settings
document.body.classList.add(
    "layout-fixed",
    "sidebar-expand-lg",
    "bg-body-tertiary"
);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>
);
