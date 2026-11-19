
import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });

    // Role will always be a string: admin or user
    const roleValue = user?.roles?.[0];

    const role =
        typeof roleValue === "string"
            ? roleValue
            : roleValue?.name || null;

    const isEmailVerified = !!token;
    const isAuthenticated = !!token;

    const login = (userData, authToken) => {

        setUser(userData);
        setToken(authToken);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", authToken);
    };

    const logout = async () => {

        try {
            await api.post("/logout");

        } catch (error) {

            console.error("Logout API failed:", error);
            throw error;

        } finally {

            setUser(null);
            setToken(null);

            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                role,
                isAuthenticated,
                isEmailVerified,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
