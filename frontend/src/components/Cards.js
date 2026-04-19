import { useNavigate } from "react-router-dom";
import { Card, Stars, Btn } from "./UI";

export function HospitalCard({ hospital }) {
  const navigate = useNavigate();
  const { id, name, city, total_doctors, rating, specialties, emoji, theme } =
    hospital;
  return (
    <Card
      hover
      onClick={() => navigate(`/hospitals/${id}`)}
      className="overflow-hidden animate-fade-up"
    >
      {/* Image area */}
      <div
        className={`h-40 bg-gradient-to-br ${theme} flex items-center justify-center relative`}
      >
        <span className="text-5xl">{emoji}</span>
        <div className="absolute top-3 right-3 bg-white rounded-full px-2.5 py-1 text-xs font-medium flex items-center gap-1 shadow-sm">
          <span className="text-amber-400">★</span> {rating}
        </div>
      </div>
      {/* Body */}
      <div className="p-5">
        <h3 className="font-head font-bold text-base mb-1">{name}</h3>
        <p className="text-xs text-[var(--muted)] mb-3 flex items-center gap-1">
          📍 {city} · <span>{total_doctors} Doctors</span>
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(specialties || []).slice(0, 3).map((s) => (
            <span
              key={s}
              className="bg-green-50 text-green-800 text-[11px] px-2.5 py-1 rounded-full font-medium"
            >
              {s}
            </span>
          ))}
        </div>
        <Btn size="sm" className="w-full justify-center">
          View Hospital
        </Btn>
      </div>
    </Card>
  );
}

export function DoctorCard({ doctor }) {
  const navigate = useNavigate();
  const {
    id,
    name,
    specialization,
    hospital_name,
    consultation_fee,
    rating,
    experience,
    initials,
    color,
  } = doctor;
  return (
    <Card
      hover
      onClick={() => navigate(`/doctors/${id}`)}
      className="p-5 animate-fade-up"
    >
      <div
        className={`w-14 h-14 ${color} rounded-full flex items-center justify-center font-display text-lg mb-4 flex-shrink-0`}
      >
        {initials}
      </div>
      <h3 className="font-head font-bold text-base mb-1">{name}</h3>
      <p className="text-green-600 text-sm font-medium mb-1">
        {specialization}
      </p>
      <p className="text-[var(--muted)] text-xs mb-4 flex items-center gap-1">
        🏥 {hospital_name}
      </p>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-head font-bold text-base">
            Rs. {consultation_fee.toLocaleString()}
          </span>
          <span className="text-[var(--faint)] text-xs"> / visit</span>
        </div>
        <Stars rating={rating} />
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(0,0,0,0.07)]">
        <span className="text-xs text-[var(--muted)]">
          {experience} yrs exp.
        </span>
        <span className="text-xs text-green-500 font-medium">Book →</span>
      </div>
    </Card>
  );
}
