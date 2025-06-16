import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, fetchProfile } from "../../../api/api";
import "./LoginPage.css";

const LoginPage = ({ setRole, setUser, setProfile }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await loginUser(email, password);

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("role", result.user.role);

        setRole(result.user.role);
        setUser(result.user);
        const profileData = await fetchProfile();
        setProfile(profileData);

        if (result.user.role === "admin") {
          navigate("/docora-fe/admin-page");
        } else {
          navigate("/docora-fe/application");
        }
      } else {
        setError("❌ Nevažeći odgovor servera.");
      }
    } catch (error) {
      setError("❌ Pogrešan email ili lozinka.");
    }
  };

  return (
    <div className="login-wrapper">
      <main className="login-main">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Prijava</h2>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Unesite email"
            autoComplete="current-email"
          />

          <label htmlFor="password">Lozinka:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Unesite lozinku"
            autoComplete="current-password"
          />

          <button type="submit" className="login-button">
            Prijavi se
          </button>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
