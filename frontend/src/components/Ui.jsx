// ─── Button ───────────────────────────────────────────────────
export function Btn({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled,
  type = "button",
}) {
  const base =
    "inline-flex items-center gap-2 font-body font-medium rounded-[10px] transition-all duration-200 cursor-pointer border-0 outline-none";
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-[11px] text-sm",
    lg: "px-7 py-[14px] text-base",
  };
  const variants = {
    primary:
      "bg-green-500 text-white hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(29,158,117,0.4)] active:translate-y-0",
    outline:
      "bg-transparent text-ink border border-[rgba(0,0,0,0.12)] hover:border-green-500 hover:text-green-500 hover:bg-green-50",
    ghost:
      "bg-transparent text-[var(--muted)] hover:bg-cream-dark hover:text-ink",
    danger: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
    white: "bg-white text-ink hover:bg-cream",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Badge / Tag ──────────────────────────────────────────────
export function Badge({ children, variant = "green" }) {
  const v = {
    green: "bg-green-50 text-green-800",
    blue: "bg-blue-50 text-blue-800",
    amber: "bg-amber-50 text-amber-800",
    red: "bg-red-50 text-red-700",
    gray: "bg-cream-dark text-[var(--muted)]",
    pending: "bg-amber-50 text-amber-800",
    confirmed: "bg-green-50 text-green-800",
    completed: "bg-blue-50 text-blue-800",
    cancelled: "bg-red-50 text-red-700",
    rejected: "bg-red-100 text-red-800",
    paid: "bg-green-50 text-green-800",
    unpaid: "bg-amber-50 text-amber-800",
  };
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium font-body ${v[variant] ?? v.gray}`}
    >
      {children}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────
export function StatusBadge({ status }) {
  return (
    <Badge variant={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

// ─── Card ─────────────────────────────────────────────────────
export function Card({ children, className = "", onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[rgba(0,0,0,0.09)] shadow-card ${hover ? "cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-hover hover:border-green-400" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────
export function Skeleton({ h = "20px", w = "100%", className = "" }) {
  return (
    <div
      className={`skeleton rounded-[10px] ${className}`}
      style={{ height: h, width: w }}
    />
  );
}

// ─── Avatar ───────────────────────────────────────────────────
export function Avatar({
  initials,
  size = "md",
  color = "bg-green-50 text-green-800",
}) {
  const sizes = {
    sm: "w-10 h-10 text-sm",
    md: "w-16 h-16 text-xl",
    lg: "w-24 h-24 text-3xl",
  };
  return (
    <div
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center font-display font-normal flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

// ─── Star Rating ──────────────────────────────────────────────
export function Stars({ rating }) {
  return (
    <span className="flex items-center gap-1 text-amber-400 text-sm">
      ★ <span className="text-[var(--muted)] font-body">{rating}</span>
    </span>
  );
}

// ─── Section Header ───────────────────────────────────────────
export function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-7">
      <h2 className="font-head font-bold text-2xl text-ink">{title}</h2>
      {action}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────
export function Empty({ icon = "📭", title, desc, action }) {
  return (
    <div className="text-center py-16 px-6 text-[var(--muted)]">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-head font-bold text-lg text-ink mb-2">{title}</h3>
      {desc && <p className="text-sm leading-relaxed mb-5">{desc}</p>}
      {action}
    </div>
  );
}

// ─── Input / Textarea ─────────────────────────────────────────
export function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider font-body">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full font-body text-sm border border-[rgba(0,0,0,0.12)] rounded-[10px] px-3.5 py-3 bg-cream text-ink outline-none transition-all focus:border-green-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,158,117,0.1)] placeholder:text-[var(--faint)]"
      />
    </div>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider font-body">
          {label}
        </label>
      )}
      <select
        {...props}
        className="w-full font-body text-sm border border-[rgba(0,0,0,0.12)] rounded-[10px] px-3.5 py-3 bg-cream text-ink outline-none transition-all focus:border-green-500 focus:bg-white"
      >
        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider font-body">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className="w-full font-body text-sm border border-[rgba(0,0,0,0.12)] rounded-[10px] px-3.5 py-3 bg-cream text-ink outline-none transition-all focus:border-green-500 focus:bg-white resize-none placeholder:text-[var(--faint)]"
      />
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────
export function Modal({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-9 w-full max-w-md shadow-hover animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────
export function Chip({ label, value }) {
  return (
    <div className="bg-cream-dark rounded-[10px] px-4 py-3 flex flex-col gap-0.5">
      <span className="text-[11px] text-[var(--faint)] uppercase tracking-wider font-body">
        {label}
      </span>
      <span className="text-sm font-semibold text-ink font-body">{value}</span>
    </div>
  );
}
