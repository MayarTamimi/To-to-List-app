import React, { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const viewLogin = (status) => {
    setError(null);
    setIsLogin(status);
  };

  const handleLogin = async (e, endpoint) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Make sure passwords match");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.details || "An error occurred on the server.");
        return;
      }

      const json = await response.json();

      if (json.details) {
        setError(json.details);
      } else {
        // Store token and email in localStorage
        localStorage.setItem("Email", json.email);
        localStorage.setItem("AuthToken", json.token);
        window.location.reload();  // Reload to trigger App to check localStorage
      }
    } catch (err) {
      console.error("Error in handleLogin:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <form>
          <h2>{isLogin ? "Please log in" : "Please sign up!"}</h2>
          <input
            type="email"
            placeholder="Enter your email.."
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            placeholder="Enter your password.."
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm your password.."
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          )}
          <input
            type="submit"
            className="create"
            onClick={(e) => handleLogin(e, isLogin ? "login" : "signup")}
          />
          {error && <p>{error}</p>}
        </form>
        <div className="auth-options">
          <button onClick={() => viewLogin(false)}>Sign up</button>
          <button onClick={() => viewLogin(true)}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
