/**
 * Main Application Component
 * Records Archive Application with authentication
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RegistryListPage from "./pages/RegistryListPage";
import RegistryDetailPage from "./pages/RegistryDetailPage";
import RegistryDefinitiveCasePage from "./pages/RegistryDefinitiveCasePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { logger } from "./utils/logger";
import "./App.css";

function App() {
  logger.info("Application initialized");

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registries"
            element={
              <ProtectedRoute>
                <RegistryListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registries/:registryId"
            element={
              <ProtectedRoute>
                <RegistryDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registries/definitive-cases"
            element={
              <ProtectedRoute>
                <RegistryDefinitiveCasePage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
