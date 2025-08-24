import { supabase } from "../../lib/supabaseClient";

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "https://bookish-trout-5grjwqgpx7pj3p79j-8080.app.github.dev/";
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
