import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchMyAppointments, cancelAppointmentAPI } from "../utils/api";
import { AppointmentCard } from "../components/AppointmentCard";
import { Btn, Empty } from "../components/UI";
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

export function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("upcoming");
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

  const today = new Date().toISOString().split("T")[0];
  const upcoming = appointments.filter(
    (a) =>
      !["cancelled", "completed"].includes(a.status) &&
      a.appointment_date >= today,
  );
  const past = appointments.filter(
    (a) =>
      ["completed", "cancelled"].includes(a.status) ||
      a.appointment_date < today,
  );

  const handleCancel = async (id) => {
    try {
      await cancelAppointmentAPI(id);
      toast.success("Appointment cancelled");
      load();
    } catch (e) {
      toast.error("Could not cancel appointment");
    }
  };

  const handlePay = (appt) => navigate("/payment", { state: { appt } });

  const displayed = tab === "upcoming" ? upcoming : past;

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
          Welcome back, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Here's your health appointment overview
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
        <StatMini icon="📅" num={appointments.length} label="Total Bookings" />
        <StatMini icon="✅" num={upcoming.length} label="Upcoming" />
        <StatMini
          icon="✔️"
          num={appointments.filter((a) => a.status === "completed").length}
          label="Completed"
        />
        <StatMini
          icon="💊"
          num={[...new Set(appointments.map((a) => a.doctor_id))].length}
          label="Doctors Seen"
        />
      </div>

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
