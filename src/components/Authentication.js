import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Authentication = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null for loading state

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("usertoken");

            if (!token) {
                setIsAuthenticated(false); // No token, user is not authenticated
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/verify-user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("response",response);
                if (response.status === 200) {
                    setIsAuthenticated(true); // Valid token
                }
            } catch (err) {
                console.error("Token authentication failed", err);
                setIsAuthenticated(false);
            }
        };

        verifyToken();
    }, []);

    // If still loading (isAuthenticated is null), render nothing or a loading spinner
    if (isAuthenticated === null) {
        return <p>Loading...</p>;
    }

    // If the user is authenticated, render children. Otherwise, redirect to login.
    if (isAuthenticated === true) {
        return children;
    } else if (isAuthenticated === false){
        window.location.href = "/";
    }
};

export default Authentication;
