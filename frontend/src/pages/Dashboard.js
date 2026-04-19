import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { PatientDashboard } from "./PatientDashboard";
import { DoctorDashboard } from "./DoctorDashboard";
import { AdminDashboard } from "./AdminDashboard";
import {
  LogOut,
  Bell,
  Home,
  Calendar,
  Users,
  Building2,
  Stethoscope,
} from "lucide-react";
import { storage } from "../utils/data";

const roleIcons = {
  patient: [
    { icon: <Home size={16} />, label: "Overview" },
    { icon: <Calendar size={16} />, label: "Appointments" },
  ],
  doctor: [
    { icon: <Home size={16} />, label: "Overview" },
    { icon: <Calendar size={16} />, label: "Appointments" },
  ],
  admin: [{ icon: <Home size={16} />, label: "Dashboard" }],
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  if (!user) return null;

  const unread = storage
    .getNotifications()
    .filter((n) => n.userId === user.id && !n.read).length;

  const roleLabel = {
    patient: "Patient",
    doctor: "Doctor",
    admin: "Administrator",
  };
  const roleColor = {
    patient: "bg-green-50 text-green-700",
    doctor: "bg-blue-50 text-blue-700",
    admin: "bg-violet-50 text-violet-700",
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
        {/* ── SIDEBAR ───────────────────────────────────── */}
        <aside className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)] p-6 sticky top-20 shadow-card">
          {/* Avatar */}
          <div className="w-14 h-14 bg-green-50 text-green-800 rounded-full flex items-center justify-center font-display text-2xl mb-3">
            {user.name[0].toUpperCase()}
          </div>
          <p className="font-head font-bold text-base leading-tight mb-1">
            {user.name}
          </p>
          <p className="text-xs text-[var(--muted)] mb-1">{user.email}</p>
          <span
            className={`inline-block text-xs px-3 py-1 rounded-full font-medium mb-6 ${roleColor[user.role]}`}
          >
            {roleLabel[user.role]}
          </span>

          {/* Nav */}
          <nav className="flex flex-col gap-1 mb-6">
            <button
              onClick={() => navigate("/notifications")}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-body text-[var(--muted)] hover:bg-cream-dark hover:text-ink transition-all text-left w-full"
            >
              <Bell size={16} />
              Notifications
              {unread > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {unread}
                </span>
              )}
            </button>
          </nav>

          <div className="border-t border-[rgba(0,0,0,0.07)] pt-4">
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-body text-red-500 hover:bg-red-50 transition-all w-full"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ──────────────────────────────── */}
        <main className="min-h-[600px]">
          {user.role === "patient" && <PatientDashboard />}
          {user.role === "doctor" && <DoctorDashboard />}
          {user.role === "admin" && <AdminDashboard />}
        </main>
      </div>
    </div>
  );
}
