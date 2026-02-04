/**
 * Login Page Component
 * Modern authentication interface with form validation
 */

import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { logger } from "../utils/logger";
import {
  API_INSTANCE_OPTIONS,
  getApiInstanceId,
  setApiInstance,
} from "../utils/apiConfig";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const defaultInstanceId =
    getApiInstanceId() || API_INSTANCE_OPTIONS[0]?.id || "";
  const [instanceId, setInstanceId] = useState(defaultInstanceId);

  useEffect(() => {
    if (instanceId) {
      setApiInstance(instanceId);
    }
  }, [instanceId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Validation
    if (!username.trim()) {
      setLocalError("Username is required");
      logger.warn("Login attempt with empty username");
      return;
    }

    if (!password.trim()) {
      setLocalError("Password is required");
      logger.warn("Login attempt with empty password");
      return;
    }

    try {
      logger.info("Submitting login form", { username });
      setApiInstance(instanceId);
      await login({ username, password, instanceId });
      logger.info("Login successful, navigating to dashboard");
      navigate("/dashboard");
    } catch (err) {
      logger.error("Login submission failed", err);
      // Error is already set by the auth context
    }
  };

  const displayError = localError || error;

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Records Archive</h1>
          <p>Authentication Required</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="instance">Instanta</label>
            <select
              id="instance"
              value={instanceId}
              onChange={(e) => setInstanceId(e.target.value)}
              disabled={loading}
            >
              {API_INSTANCE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {displayError && (
            <div className="error-message" role="alert">
              {displayError}
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>Aplicatia registrelor din Ministerul Justitiei</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
