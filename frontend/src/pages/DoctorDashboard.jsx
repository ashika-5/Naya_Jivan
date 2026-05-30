import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchMyAppointments, updateAppointmentStatus } from "../utils/api";
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
  const [tab, setTab] = useState("pending");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchMyAppointments();
      setAppointments(data);
    } catch (e) {
      toast.error("Could not load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pending = appointments.filter((a) => a.status === "pending");
  const confirmed = appointments.filter((a) => a.status === "confirmed");
  const completed = appointments.filter((a) => a.status === "completed");
  const earned = appointments
    .filter((a) => a.payment_status === "paid")
    .reduce((s, a) => s + Number(a.amount || 0), 0);

  const act = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Appointment ${status}`);
      load();
    } catch (e) {
      toast.error("Could not update status");
    }
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
        : [...appointments].reverse();

  if (loading)
    return (
      <div className="text-center py-20 text-[var(--muted)]">
        Loading appointments…
      </div>
    );

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
        <StatMini icon="👥" num={appointments.length} label="Total Patients" />
        <StatMini icon="⏳" num={pending.length} label="Pending" />
        <StatMini icon="✅" num={confirmed.length} label="Confirmed" />
        <StatMini
          icon="💰"
          num={`Rs. ${earned.toLocaleString()}`}
          label="Earned"
        />
      </div>

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
              appt={a}
              onAccept={
                a.status === "pending"
                  ? (id) => act(id, "confirmed")
                  : undefined
              }
              onReject={
                a.status === "pending" ? (id) => act(id, "rejected") : undefined
              }
              onComplete={
                a.status === "confirmed"
                  ? (id) => act(id, "completed")
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
