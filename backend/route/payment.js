import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { storage, pushNotification } from "../utils/data";
import { Btn } from "../components/UI";
import toast from "react-hot-toast";

const METHODS = [
  {
    id: "esewa",
    logo: (
      <span className="bg-[#60bb46] text-white text-sm font-bold px-3 py-1 rounded-lg tracking-wide">
        eSewa
      </span>
    ),
    name: "eSewa",
    desc: "Pay using eSewa digital wallet (test mode)",
  },
  {
    id: "cash",
    logo: <span className="text-3xl">💵</span>,
    name: "Pay at Hospital",
    desc: "Pay cash when you visit the hospital",
  },
];

export default function Payment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pendingBooking, bookAppointment, setPendingBooking } = useBooking();
  const [method, setMethod] = useState("esewa");
  const [processing, setProcessing] = useState(false);

  if (!pendingBooking) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="text-[var(--muted)] mb-4">No pending booking found.</p>
        <Btn onClick={() => navigate("/doctors")}>Find a Doctor</Btn>
      </div>
    );
  }

  const { doctorName, hospitalName, date, time, amount, specialization } =
    pendingBooking;

  const handlePay = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1400)); // simulate payment processing

    const status = method === "esewa" ? "confirmed" : "pending";
    const paymentStatus = method === "esewa" ? "paid" : "unpaid";

    const appt = bookAppointment({
      ...pendingBooking,
      status,
      paymentStatus,
      paymentMethod: method,
    });

    pushNotification(
      user.id,
      method === "esewa"
        ? "Appointment Confirmed! 🎉"
        : "Appointment Submitted",
      method === "esewa"
        ? `Your appointment with ${doctorName} on ${date} at ${time} is confirmed.`
        : `Your appointment request with ${doctorName} on ${date} has been submitted and is pending confirmation.`,
      "appointment",
    );

    setPendingBooking(null);
    setProcessing(false);
    toast.success(
      method === "esewa"
        ? "Payment successful! Appointment confirmed."
        : "Appointment submitted!",
    );
    navigate("/dashboard");
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-14">
      <div className="bg-white rounded-2xl p-10 border border-[rgba(0,0,0,0.09)] shadow-card animate-fade-up">
        <h1 className="font-head font-extrabold text-2xl mb-1">
          Complete Payment
        </h1>
        <p className="text-sm text-[var(--muted)] mb-7">
          Secure your appointment by completing payment below.
        </p>
        {/* Summary */}
        <div className="bg-green-50 rounded-xl p-5 mb-7">
          <p className="text-xs text-green-700 font-medium mb-1 uppercase tracking-wider">
            Consultation Fee
          </p>
          <p className="font-head font-extrabold text-3xl text-green-800">
            Rs. {amount?.toLocaleString()}
          </p>
          <p className="text-xs text-green-700 mt-2">
            {doctorName} · {specialization}
          </p>
          <p className="text-xs text-green-700">
            {date} at {time} · {hospitalName}
          </p>
        </div>
        {/* Payment methods */}
        <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
          Select Payment Method
        </p>
        <div className="space-y-3 mb-7">
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150
                ${
                  method === m.id
                    ? "border-green-500 bg-green-50"
                    : "border-[rgba(0,0,0,0.1)] hover:border-green-300"
                }`}
            >
              <div className="w-14 flex items-center justify-center">
                {m.logo}
              </div>
              <div>
                <p className="font-semibold text-sm font-body">{m.name}</p>
                <p className="text-xs text-[var(--muted)]">{m.desc}</p>
              </div>
              <div
                className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${method === m.id ? "border-green-500 bg-green-500" : "border-[rgba(0,0,0,0.2)]"}`}
              >
                {method === m.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>
        {/* eSewa test creds */}
        {method === "esewa" && (
          <div className="bg-cream rounded-xl p-4 mb-7 animate-slide-up">
            <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
              eSewa Test Credentials
            </p>
            <div className="space-y-1.5 text-sm">
              <p>
                📱 Phone: <strong>9806800001</strong>
              </p>
              <p>
                🔑 MPIN: <strong>1122</strong>
              </p>
              <p className="text-xs text-[var(--faint)] mt-2">
                Use these on the eSewa sandbox payment page
              </p>
            </div>
          </div>
        )}
        <Btn
          className="w-full justify-center py-4 text-base"
          onClick={handlePay}
          disabled={processing}
        >
          {processing ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Processing…
            </span>
          ) : method === "esewa" ? (
            "🔒 Confirm & Pay"
          ) : (
            "Submit Appointment"
          )}
        </Btn>
        // button
        <Btn
          variant="ghost"
          className="w-full justify-center mt-3"
          onClick={() => {
            setPendingBooking(null);
            navigate("/doctors");
          }}
        >
          Cancel
        </Btn>
      </div>
    </div>
  );
}
