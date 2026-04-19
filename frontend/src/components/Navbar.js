import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Btn } from "./UI";
import { Bell } from "lucide-react";
import { storage } from "../utils/data";

export default function Navbar() {
  const { user, logout, setAuthModal } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const unread = user
    ? storage.getNotifications().filter((n) => n.userId === user.id && !n.read)
        .length
    : 0;

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`font-body text-sm px-3.5 py-2 rounded-lg transition-all duration-150 ${loc.pathname === to ? "text-green-500 bg-green-50 font-medium" : "text-[var(--muted)] hover:text-ink hover:bg-cream-dark"}`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-40 bg-cream/90 backdrop-blur-xl border-b border-[rgba(0,0,0,0.07)]">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-head font-extrabold text-xl text-ink"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          MedBook
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLink("/", "Home")}
          {navLink("/hospitals", "Hospitals")}
          {navLink("/doctors", "Doctors")}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button
                onClick={() => navigate("/notifications")}
                className="relative p-2 rounded-lg hover:bg-cream-dark transition-colors"
              >
                <Bell size={18} className="text-[var(--muted)]" />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
              <Btn size="sm" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Btn>
              <Btn
                size="sm"
                variant="outline"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Sign out
              </Btn>
            </>
          ) : (
            <>
              <Btn
                size="sm"
                variant="ghost"
                onClick={() => setAuthModal("login")}
              >
                Log in
              </Btn>
              <Btn size="sm" onClick={() => setAuthModal("register")}>
                Get Started
              </Btn>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
