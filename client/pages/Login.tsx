import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Scale } from "lucide-react"; 
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // ⬇️ This is your login handler with external redirect
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("✅ Logged in successfully!");
      setTimeout(() => {
        window.location.href = "https://bookish-trout-5grjwqgpx7pj3p79j-8080.app.github.dev/";
      }, 1000); // 1 second delay before redirect
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800">
      <div className="bg-white/95 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Scale className="w-12 h-12 text-indigo-700" />
          <h2 className="mt-3 text-2xl font-bold text-gray-800">NyayaPath</h2>
          <p className="text-sm text-gray-500">Access Justice. Simplified.</p>
        </div>
        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-indigo-700 text-white font-semibold py-3 rounded-lg hover:bg-indigo-800 transition"
          >
            Log In
          </button>
        </form>
        {/* Message */}
        {message && (
          <div
            className={`mt-4 text-center font-medium ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
        {/* Signup Link */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
