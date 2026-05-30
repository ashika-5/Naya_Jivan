import { useNavigate } from "react-router-dom";
import { HOSPITALS, DOCTORS } from "../utils/data";
import { HospitalCard } from "../components/Cards";
import { DoctorCard } from "../components/Cards";
import { Btn, SectionHeader } from "../components/UI";

export default function Home() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: "🔍",
      title: "Search & Filter",
      desc: "Browse doctors by specialty, hospital or location across Nepal",
    },
    {
      icon: "📅",
      title: "Pick a Slot",
      desc: "Choose your preferred date and available time slot in seconds",
    },
    {
      icon: "💳",
      title: "Pay Securely",
      desc: "Pay via eSewa — Nepal's most trusted digital payment platform",
    },
    {
      icon: "✅",
      title: "Get Confirmed",
      desc: "Receive instant booking confirmation and appointment reminders",
    },
  ];

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div
          className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide mb-8 animate-fade-up"
          style={{ animationDelay: "0s" }}
        >
          🏥 Nepal's Smartest Health Platform
        </div>

        <h1
          className="font-display text-[clamp(44px,7vw,80px)] leading-[1.06] text-ink mb-6 animate-fade-up"
          style={{ animationDelay: "0.08s" }}
        >
          Find the right doctor,
          <br />
          <em className="italic text-green-500">effortlessly</em>
        </h1>

        <p
          className="text-lg text-[var(--muted)] max-w-xl leading-relaxed mb-10 font-light animate-fade-up"
          style={{ animationDelay: "0.14s" }}
        >
          Browse top hospitals, explore specialist profiles, and book
          appointments instantly — from anywhere, anytime.
        </p>

        <div
          className="flex gap-4 flex-wrap animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <Btn size="lg" onClick={() => navigate("/doctors")}>
            Find a Doctor
          </Btn>
          <Btn
            size="lg"
            variant="outline"
            onClick={() => navigate("/hospitals")}
          >
            View Hospitals
          </Btn>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-16 stagger">
          {[
            ["5+", "Top Hospitals"],
            ["8+", "Specialist Doctors"],
            ["24/7", "Online Booking"],
          ].map(([num, label]) => (
            <div
              key={label}
              className="bg-white rounded-xl p-6 border border-[rgba(0,0,0,0.09)] shadow-card animate-fade-up"
            >
              <div className="font-head font-bold text-4xl text-ink">{num}</div>
              <div className="text-sm text-[var(--muted)] mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED DOCTORS ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <SectionHeader
          title="Top Doctors"
          action={
            <Btn
              size="sm"
              variant="outline"
              onClick={() => navigate("/doctors")}
            >
              View All →
            </Btn>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {DOCTORS.slice(0, 3).map((d) => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </div>
      </section>

      {/* ── FEATURED HOSPITALS ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <SectionHeader
          title="Our Hospitals"
          action={
            <Btn
              size="sm"
              variant="outline"
              onClick={() => navigate("/hospitals")}
            >
              View All →
            </Btn>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {HOSPITALS.slice(0, 3).map((h) => (
            <HospitalCard key={h.id} hospital={h} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="bg-ink py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-[40px] text-white text-center mb-14">
            How it <em className="italic text-green-400">works</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-5">
                  {icon}
                </div>
                <h3 className="font-head font-bold text-white text-lg mb-2">
                  {title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
