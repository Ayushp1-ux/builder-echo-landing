import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Scale } from "lucide-react"; 
import { Link } from "react-router-dom";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("✅ Registered successfully. Please check your email.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3a8a, #0f172a)",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 40,
          borderRadius: 12,
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        {/* Branding */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Scale size={40} color="#b45309" />
          <h1
            style={{
              fontSize: 26,
              fontWeight: "700",
              marginTop: 10,
              color: "#1e293b",
              letterSpacing: 1,
            }}
          >
            NyayaPath
          </h1>
          <p style={{ color: "#475569", fontSize: 14 }}>
            Justice. Transparency. Trust.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              marginBottom: 14,
              padding: 12,
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              fontSize: 14,
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              marginBottom: 18,
              padding: 12,
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              fontSize: 14,
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 6,
              border: "none",
              background: "linear-gradient(90deg, #1e3a8a, #2563eb)",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: 15,
              letterSpacing: 0.5,
            }}
          >
            Sign Up
          </button>
        </form>

        {/* Message */}
        {message && (
          <div
            style={{
              marginTop: 15,
              color: message.includes("✅") ? "#16a34a" : "#dc2626",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {message}
          </div>
        )}

        {/* Link to login */}
        <div style={{ marginTop: 12, textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2563eb", fontWeight: 500 }}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
