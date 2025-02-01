import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard.js";
import AddProject from "./pages/AddProject";
import TestCaseManagement from "./pages/TestCaseManagement";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { WebSocketProvider } from "./contexts/WebSocketContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";

const Routes = () => {
    const [userId, setUserId] = useState(() => localStorage.getItem("userId"));

    const updateId = (id) => {
        localStorage.setItem("userId", id);
        setUserId(id);
    }

    const PUBLIC_ROUTES = [
        {
            path: "/login",
            element: <Login updateId={updateId} />,
        },
    ];

    const PRIVATE_ROUTES = [
        {
            path: "/",
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/",
                    element: <WebSocketProvider userId={userId} />,
                    children: [
                        {
                            path: "/dashboard",
                            element: <Dashboard />,
                        },
                        {
                            path: "/add-project",
                            element: <AddProject />,
                        },
                        {
                            path: "/test-case-management",
                            element: <TestCaseManagement />,
                        },
                    ],
                },
            ],
        },
    ];

    const router = createBrowserRouter([
        ...PUBLIC_ROUTES,
        ...PRIVATE_ROUTES
    ]);

    return <RouterProvider router={router} />
};

export default Routes;
