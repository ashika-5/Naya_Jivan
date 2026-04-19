import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { storage, pushNotification } from "../utils/data";
import { AppointmentCard } from "../components/AppointmentCard";
import { Empty } from "../components/UI";
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

export function DoctorDashboard() {
  const { user } = useAuth();
  const { updateStatus } = useBooking();
  const doctorId = user.doctorId || 1;
  const [tab, setTab] = useState("pending");
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  const all = storage.getAppointments().filter((a) => a.doctorId === doctorId);
  const pending = all.filter((a) => a.status === "pending");
  const confirmed = all.filter((a) => a.status === "confirmed");
  const completed = all.filter((a) => a.status === "completed");
  const earned = all
    .filter((a) => a.paymentStatus === "paid")
    .reduce((s, a) => s + (a.amount || 0), 0);

  const act = (id, status, patientId, date) => {
    updateStatus(id, status);
    const msg =
      status === "confirmed"
        ? `Your appointment on ${date} has been confirmed! Please arrive 10 minutes early.`
        : `Your appointment on ${date} has been ${status}.`;
    pushNotification(
      patientId,
      `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      msg,
      "appointment",
    );
    toast.success(`Appointment ${status}`);
    refresh();
  };

  const tabs = [
    { id: "pending", label: `Pending (${pending.length})` },
    { id: "confirmed", label: `Confirmed (${confirmed.length})` },
    { id: "all", label: "All" },
  ];

  const displayed =
    tab === "pending"
      ? pending
      : tab === "confirmed"
        ? confirmed
        : all.slice().reverse();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-head font-extrabold text-2xl mb-1">
          Doctor Dashboard
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Manage your appointments and patient requests
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
        <StatMini icon="👥" num={all.length} label="Total Patients" />
        <StatMini icon="⏳" num={pending.length} label="Pending" />
        <StatMini icon="✅" num={confirmed.length} label="Confirmed" />
        <StatMini
          icon="💰"
          num={`Rs. ${earned.toLocaleString()}`}
          label="Earned"
        />
      </div>

      {/* Tabs */}
      <div className="flex bg-cream-dark rounded-xl p-1 mb-5 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-[10px] text-sm font-medium font-body transition-all whitespace-nowrap ${tab === t.id ? "bg-white text-ink shadow-sm" : "text-[var(--muted)]"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)]">
          <Empty
            icon="📭"
            title={`No ${tab} appointments`}
            desc="Appointment requests will appear here."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((a) => (
            <AppointmentCard
              key={a.id}
              appt={{ ...a, doctorName: undefined }}
              onAccept={
                a.status === "pending"
                  ? (id) => act(id, "confirmed", a.patientId, a.date)
                  : undefined
              }
              onReject={
                a.status === "pending"
                  ? (id) => act(id, "rejected", a.patientId, a.date)
                  : undefined
              }
              onComplete={
                a.status === "confirmed"
                  ? (id) => act(id, "completed", a.patientId, a.date)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
