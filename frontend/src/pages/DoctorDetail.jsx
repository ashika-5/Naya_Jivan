import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DOCTORS, HOSPITALS } from "../utils/data";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { Chip, Stars, Btn, Modal, Input, Textarea } from "../components/UI";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const REVIEWS = [
  {
    name: "Sita Thapa",
    rating: 5,
    text: "Excellent doctor! Very thorough and caring. Explained everything in simple terms and made me feel at ease.",
  },
  {
    name: "Ram Prasad KC",
    rating: 4,
    text: "Good experience overall. The booking process was smooth and the doctor was on time. Highly recommend.",
  },
  {
    name: "Priya Maharjan",
    rating: 5,
    text: "Best doctor I have visited. Very knowledgeable and patient. Will definitely book again.",
  },
];

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setAuthModal } = useAuth();
  const { setPendingBooking, getBookedSlots } = useBooking();

  const doctor = DOCTORS.find((d) => d.id === Number(id));
  const hospital = doctor
    ? HOSPITALS.find((h) => h.id === doctor.hospital_id)
    : null;

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const bookedSlots = useMemo(
    () => (doctor ? getBookedSlots(doctor.id, date) : []),
    [doctor, date, getBookedSlots],
  );

  if (!doctor || !hospital)
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center text-[var(--muted)]">
        Doctor not found.
      </div>
    );

  const {
    name,
    specialization,
    experience,
    qualification,
    bio,
    rating,
    consultation_fee,
    available_days,
    available_slots,
    initials,
    color,
  } = doctor;

  const handleBook = () => {
    if (!user) {
      setAuthModal("login");
      return;
    }
    if (user.role !== "patient") {
      toast.error("Only patients can book appointments");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setPendingBooking({
      doctorId: doctor.id,
      doctorName: doctor.name,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      specialization: doctor.specialization,
      date,
      time: selectedSlot,
      notes,
      amount: consultation_fee,
      patientId: user.id,
      patientName: user.name,
    });
    setShowConfirm(false);
    navigate("/payment");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 pb-20">
      <button
        onClick={() => navigate("/doctors")}
        className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-green-500 transition-colors mb-8 font-body"
      >
        <ArrowLeft size={16} /> Back to Doctors
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* ── LEFT: Doctor info ─────────────────────────────── */}
        <div className="space-y-6">
          {/* Profile card */}
          <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)] p-8 animate-fade-up">
            <div
              className={`w-24 h-24 ${color} rounded-full flex items-center justify-center font-display text-4xl mb-5`}
            >
              {initials}
            </div>
            <h1 className="font-head font-extrabold text-3xl mb-1">{name}</h1>
            <p className="text-green-600 font-medium text-base mb-2">
              {specialization}
            </p>
            <p className="text-[var(--muted)] text-sm flex items-center gap-1 mb-6">
              🏥 {hospital.name} · {hospital.city}
            </p>
            <p className="text-[var(--muted)] leading-relaxed mb-7 font-light">
              {bio}
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Chip label="Experience" value={`${experience} Years`} />
              <Chip label="Rating" value={`⭐ ${rating}`} />
              <Chip label="Qualification" value={qualification} />
            </div>

            <div>
              <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                Available Days
              </p>
              <div className="flex flex-wrap gap-2">
                {available_days.map((day) => (
                  <span
                    key={day}
                    className="bg-green-50 text-green-800 text-xs px-3 py-1.5 rounded-lg font-medium"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div
            className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)] p-8 animate-fade-up"
            style={{ animationDelay: "0.08s" }}
          >
            <h2 className="font-head font-bold text-lg mb-5">
              Patient Reviews
            </h2>
            <div className="space-y-4">
              {REVIEWS.map((r, i) => (
                <div key={i} className="bg-cream rounded-xl p-4">
                  <div className="text-amber-400 text-sm mb-1">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>
                  <p className="font-semibold text-sm mb-1 font-body">
                    {r.name}
                  </p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Booking Panel ──────────────────────────── */}
        <div
          className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)] p-7 sticky top-20 animate-fade-up"
          style={{ animationDelay: "0.04s" }}
        >
          <h2 className="font-head font-bold text-xl mb-1">Book Appointment</h2>
          <div className="font-head font-bold text-3xl text-green-500 mb-7">
            Rs. {consultation_fee.toLocaleString()}
            <span className="text-sm font-normal text-[var(--muted)] ml-1">
              / visit
            </span>
          </div>

          {/* Date picker */}
          <div className="flex flex-col gap-2 mb-5">
            <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider font-body">
              Select Date
            </label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSelectedSlot("");
              }}
              className="w-full font-body text-sm border border-[rgba(0,0,0,0.12)] rounded-[10px] px-3.5 py-3 bg-cream text-ink outline-none transition-all focus:border-green-500 focus:bg-white"
            />
          </div>

          {/* Slots */}
          <div className="mb-5">
            <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider font-body block mb-2">
              Available Time Slots
            </label>
            <div className="slots-grid">
              {available_slots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => !isBooked && setSelectedSlot(slot)}
                    className={`py-2.5 px-2 rounded-lg border text-xs font-body text-center transition-all duration-150
                      ${
                        isBooked
                          ? "bg-red-50 border-red-200 text-red-300 cursor-not-allowed line-through"
                          : isSelected
                            ? "bg-green-500 border-green-500 text-white shadow-sm"
                            : "bg-cream border-[rgba(0,0,0,0.1)] text-ink hover:border-green-500 hover:text-green-600 hover:bg-green-50 cursor-pointer"
                      }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <Textarea
            label="Reason for Visit (optional)"
            rows={3}
            placeholder="Describe your symptoms or reason…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Btn
            className="w-full justify-center mt-5 py-3.5 text-base"
            onClick={handleBook}
          >
            Book Appointment
          </Btn>
          <p className="text-center text-xs text-[var(--muted)] mt-3">
            🔒 Secure & confidential
          </p>
        </div>
      </div>

      {/* ── Confirm Modal ───────────────────────────────────── */}
      <Modal show={showConfirm} onClose={() => setShowConfirm(false)}>
        <h3 className="font-head font-extrabold text-2xl mb-1">
          Confirm Appointment
        </h3>
        <p className="text-sm text-[var(--muted)] mb-6">
          Review your booking details before proceeding to payment.
        </p>

        <div className="bg-cream rounded-xl p-5 mb-6 space-y-3 text-sm">
          {[
            ["Doctor", name],
            ["Specialty", specialization],
            ["Hospital", hospital.name],
            ["Date", date],
            ["Time", selectedSlot],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between">
              <span className="text-[var(--muted)]">{label}</span>
              <strong>{val}</strong>
            </div>
          ))}
          <div className="flex justify-between pt-3 border-t border-[rgba(0,0,0,0.08)]">
            <span className="text-[var(--muted)]">Consultation Fee</span>
            <strong className="text-green-500 text-lg font-head">
              Rs. {consultation_fee.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Btn variant="outline" onClick={() => setShowConfirm(false)}>
            Cancel
          </Btn>
          <Btn onClick={handleConfirm}>Proceed to Payment</Btn>
        </div>
      </Modal>
    </div>
  );
}
