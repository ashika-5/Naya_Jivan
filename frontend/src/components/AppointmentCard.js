import { StatusBadge, Btn } from "./UI";

export function AppointmentCard({
  appt,
  onCancel,
  onAccept,
  onReject,
  onComplete,
  onPay,
}) {
  const d = new Date(appt.date);
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "short" });

  return (
    <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)] shadow-card p-5 flex flex-wrap items-center gap-4 animate-fade-up">
      {/* Date pill */}
      <div className="bg-green-50 rounded-xl px-4 py-3 text-center min-w-[62px]">
        <div className="font-head font-extrabold text-2xl text-green-800 leading-none">
          {day}
        </div>
        <div className="text-[11px] text-green-600 uppercase tracking-wider mt-1">
          {month}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-[160px]">
        <div className="font-head font-bold text-base mb-0.5">
          {appt.doctorName || appt.patientName || "Patient"}
        </div>
        <div className="text-xs text-[var(--muted)] mb-1">
          {appt.specialization || ""} · {appt.hospitalName}
        </div>
        <div className="text-sm font-medium text-ink flex items-center gap-2">
          🕐 {appt.time}
          {appt.amount && (
            <span className="text-xs text-[var(--muted)]">
              · Rs. {appt.amount.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <StatusBadge status={appt.status} />

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {onPay &&
          appt.paymentStatus === "unpaid" &&
          appt.status !== "cancelled" && (
            <Btn size="sm" onClick={() => onPay(appt)}>
              Pay Now
            </Btn>
          )}
        {onCancel && appt.status === "pending" && (
          <Btn size="sm" variant="danger" onClick={() => onCancel(appt.id)}>
            Cancel
          </Btn>
        )}
        {onAccept && appt.status === "pending" && (
          <Btn size="sm" onClick={() => onAccept(appt.id)}>
            Accept
          </Btn>
        )}
        {onReject && appt.status === "pending" && (
          <Btn size="sm" variant="danger" onClick={() => onReject(appt.id)}>
            Reject
          </Btn>
        )}
        {onComplete && appt.status === "confirmed" && (
          <Btn size="sm" variant="outline" onClick={() => onComplete(appt.id)}>
            Complete
          </Btn>
        )}
      </div>
    </div>
  );
}
