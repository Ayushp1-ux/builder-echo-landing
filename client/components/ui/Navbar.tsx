import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLawyer, setIsLawyer] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setIsLawyer(data?.role === "lawyer");
      }
    }
    fetchUser();

    // Close dropdown on outside click
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "flex-end", background: "#fff", padding: 16, boxShadow: "0 1px 3px #0001" }}>
      <Link to="/ask-question" style={{ color: "#2563eb", fontWeight: "bold" }}>
        Ask a Legal Question
      </Link>

      {!userEmail && (
        <>
          <Link to="/login" style={{ color: "#2563eb", fontWeight: "bold" }}>Login</Link>
          <Link to="/signup" style={{ color: "#2563eb", fontWeight: "bold" }}>Sign Up</Link>
        </>
      )}

      {userEmail && (
        <div style={{ position: "relative" }} ref={dropdownRef}>
          {/* Three-dot icon */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="User menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 24,
              color: "#2563eb",
              fontWeight: "bold",
            }}
          >
            &#8942;
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                marginTop: 8,
                background: "white",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: 4,
                width: 200,
                zIndex: 1000,
              }}
            >
              <div style={{ padding: "8px 16px", borderBottom: "1px solid #eee", fontWeight: "bold", color: "#333" }}>
                {userEmail}
              </div>

              <nav style={{ display: "flex", flexDirection: "column" }}>
                <Link
                  to="/my-questions"
                  onClick={() => setDropdownOpen(false)}
                  style={{ padding: "10px 16px", textDecoration: "none", color: "#2563eb", borderBottom: "1px solid #eee" }}
                >
                  My Legal Questions
                </Link>
                {isLawyer && (
                  <Link
                    to="/lawyer"
                    onClick={() => setDropdownOpen(false)}
                    style={{ padding: "10px 16px", textDecoration: "none", color: "#2563eb", borderBottom: "1px solid #eee" }}
                  >
                    Lawyer Dashboard
                  </Link>
                )}
                <div style={{ padding: "10px 16px" }}>
                  <LogoutButton />

                </div>
              </nav>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
