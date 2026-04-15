import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import { useUser } from "../../util/UserContext";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/auth/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data.data.user));
      setUser(data.data.user);
      toast.success("Welcome back!");
      navigate("/discover");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-main)", padding: "20px" }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card" 
        style={{ width: "100%", maxWidth: "450px", padding: "50px", textAlign: "center" }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>Welcome <span className="text-gradient">Back</span></h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "40px" }}>Continue your journey of mutual growth.</p>

        <form onSubmit={handleEmailLogin} style={{ textAlign: "left", marginBottom: "30px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-muted)" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <FaEnvelope style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dark)" }} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "12px 15px 12px 45px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "12px", color: "white", outline: "none" }}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-muted)" }}>Password</label>
            <div style={{ position: "relative" }}>
              <FaLock style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dark)" }} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "12px 15px 12px 45px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "12px", color: "white", outline: "none" }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: "25px" }}>
            <Link to="/forgot-password" style={{ fontSize: "0.85rem", color: "var(--primary)", textDecoration: "none" }}>Forgot Password?</Link>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: "100%", padding: "14px", borderRadius: "12px", fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "15px", margin: "25px 0", color: "var(--text-dark)" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border-glass)" }} />
          <span style={{ fontSize: "0.8rem" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-glass)" }} />
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="glass" 
          style={{ width: "100%", padding: "14px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", color: "white", cursor: "pointer", transition: "var(--transition-smooth)" }}
        >
          <FaGoogle /> Login with Google
        </button>

        <p style={{ marginTop: "30px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--secondary)", textDecoration: "none", fontWeight: "600" }}>Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
