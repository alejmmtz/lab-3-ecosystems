import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import "@hackernoon/pixel-icon-library/fonts/iconfont.css";

import Login from "./pages/login/Login";
import Consumer from "./pages/consumer/Consumer";
import Store from "./pages/store/Store";
import Delivery from "./pages/delivery/Delivery";
import ProtectedRoute from "./components/ProtectedRoute";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/consumer"
          element={
            <ProtectedRoute allowedRole="consumer">
              <Consumer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store"
          element={
            <ProtectedRoute allowedRole="store">
              <Store />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery"
          element={
            <ProtectedRoute allowedRole="delivery">
              <Delivery />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
