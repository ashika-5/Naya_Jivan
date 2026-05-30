import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchHospital } from "../utils/api";
import { Btn } from "../components/UI";
import toast from "react-hot-toast";

export default function HospitalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospital(id)
      .then(setHospital)
      .catch(() => toast.error("Hospital not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-32 text-[var(--muted)]">Loading…</div>
    );
  if (!hospital)
    return (
      <div className="text-center py-32 text-[var(--muted)]">
        Hospital not found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-[var(--muted)] hover:text-ink mb-6 flex items-center gap-1"
      >
        ← Back
      </button>
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.09)] p-8 mb-6">
        <h1 className="font-head font-extrabold text-3xl mb-1">
          {hospital.name}
        </h1>
        <p className="text-[var(--muted)] text-sm mb-4">
          {hospital.address}, {hospital.city}
        </p>
        <p className="text-sm leading-relaxed mb-6">{hospital.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {(typeof hospital.specialties === "string"
            ? JSON.parse(hospital.specialties)
            : hospital.specialties || []
          ).map((s) => (
            <span
              key={s}
              className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
          <span>📞 {hospital.phone}</span>
          <span>✉️ {hospital.email}</span>
          <span>⭐ {hospital.rating}</span>
          <span>🩺 {hospital.total_doctors} doctors</span>
        </div>
      </div>

      {hospital.doctors?.length > 0 && (
        <div>
          <h2 className="font-head font-bold text-xl mb-4">
            Doctors at this Hospital
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospital.doctors.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)] p-5 flex justify-between items-start"
              >
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {d.specialization}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    Rs. {d.consultation_fee} · ⭐ {d.rating}
                  </p>
                </div>
                <Btn size="sm" onClick={() => navigate(`/doctors/${d.id}`)}>
                  Book
                </Btn>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
