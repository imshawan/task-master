import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const AuthenticatedRoute = ({ role, children }) => {
    const isAuthenticated = JSON.parse(localStorage.getItem('authenticated'));
    const {pathname} = useLocation();

    if (isAuthenticated && pathname !== '/signin') {
        return children ? children : <Outlet />
    } else {
        return <Navigate to="/signin" />
    }
};