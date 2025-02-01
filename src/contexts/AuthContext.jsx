import { createContext, useState, useEffect, useMemo, useContext } from 'react';
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("authToken"));
    const contextValue = useMemo(() => ({ token, setToken }), [token]);

    useEffect(() => {
        if (!token) return;

        (async () => {
            try {
                const response = await axios.get("http://localhost:5000/verify-user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status !== 200) {
                    throw new Error("Error validating token");
                }
            } catch (err) {
                console.error("Token authentication failed", err);
                localStorage.removeItem("authToken");
                setToken(null);
            }
        })();
    }, [token]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}
