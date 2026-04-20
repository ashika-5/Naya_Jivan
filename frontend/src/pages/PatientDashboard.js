import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { storage, pushNotification } from "../utils/data";
import { AppointmentCard } from "../components/AppointmentCard";
import { Btn, Empty, SectionHeader } from "../components/UI";
import toast from "react-hot-toast";

function StatMini({ icon, num, label }) {
  return (
    <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)] p-5 animate-fade-up">
      <div className="text-2xl mb-3">{icon}</div>
      <div className="font-head font-bold text-3xl text-ink">{num}</div>
      <div className="text-xs text-[var(--muted)] mt-1">{label}</div>
    </div>
  );
}

// ── PATIENT ──────────────────────────────────────────────────
export function PatientDashboard() {
  const { user } = useAuth();
  const { cancelAppointment } = useBooking();
  const navigate = useNavigate();
  const [tab, setTab] = useState("upcoming");
  const [, forceUpdate] = useState(0);

  const refresh = () => forceUpdate((n) => n + 1);

  const all = storage.getAppointments().filter((a) => a.patientId === user.id);
  const upcoming = all.filter(
    (a) =>
      !["cancelled", "completed"].includes(a.status) &&
      new Date(a.date) >= new Date(),
  );
  const past = all.filter(
    (a) =>
      ["completed", "cancelled"].includes(a.status) ||
      new Date(a.date) < new Date(),
  );

  const handleCancel = (id) => {
    cancelAppointment(id);
    pushNotification(
      user.id,
      "Appointment Cancelled",
      "Your appointment has been cancelled successfully.",
      "appointment",
    );
    toast.success("Appointment cancelled");
    refresh();
  };

  const handlePay = (appt) => {
    navigate("/payment", { state: { appt } });
  };

  const displayed = tab === "upcoming" ? upcoming : past;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-head font-extrabold text-2xl mb-1">
          Welcome back, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Here's your health appointment overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
        <StatMini icon="📅" num={all.length} label="Total Bookings" />
        <StatMini icon="✅" num={upcoming.length} label="Upcoming" />
        <StatMini
          icon="✔️"
          num={all.filter((a) => a.status === "completed").length}
          label="Completed"
        />
        <StatMini
          icon="💊"
          num={[...new Set(all.map((a) => a.doctorId))].length}
          label="Doctors Seen"
        />
      </div>

      {/* Tabs + book button */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex bg-cream-dark rounded-xl p-1">
          {["upcoming", "history"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-[10px] text-sm font-medium font-body transition-all ${tab === t ? "bg-white text-ink shadow-sm" : "text-[var(--muted)]"}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <Btn size="sm" onClick={() => navigate("/doctors")}>
          + Book New
        </Btn>
      </div>

      {displayed.length === 0 ? (
        <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)]">
          <Empty
            icon="📭"
            title={
              tab === "upcoming"
                ? "No upcoming appointments"
                : "No appointment history"
            }
            desc="Book your first appointment with a top specialist."
            action={
              <Btn onClick={() => navigate("/doctors")}>Find a Doctor</Btn>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((a) => (
            <AppointmentCard
              key={a.id}
              appt={a}
              onCancel={tab === "upcoming" ? handleCancel : undefined}
              onPay={tab === "upcoming" ? handlePay : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
