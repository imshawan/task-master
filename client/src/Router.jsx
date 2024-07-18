import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthenticatedRoute } from "./AuthenticatedRoute";
import SignIn from "./screens/Signin";
import Register from "./screens/Register";
import TaskList from "./screens/Tasks";
import NotFound from "./screens/404";
import Profile from "./screens/Profile";
import About from "./screens/About";

export default function Router() {
    const isAuthenticated = JSON.parse(localStorage.getItem('authenticated'));

    return (
        <BrowserRouter>
          <Routes>
              <Route
                  path="/signin"
                  element={isAuthenticated ? <Navigate to="/" replace /> : <SignIn />}
              />
              <Route path="/" element={<AuthenticatedRoute><TaskList /></AuthenticatedRoute>} />
              <Route path="/profile" element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>} />
              <Route path="/register" element={isAuthenticated ? <Navigate to={'/'} /> : <Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}