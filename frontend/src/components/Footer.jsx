import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-20 pt-14 pb-8">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <div>
          <div className="font-head font-extrabold text-xl mb-3 flex items-center gap-2">
            <span className="text-green-400">●</span> MedBook
          </div>
          <p className="text-sm text-white/50 leading-relaxed">
            Nepal's smartest healthcare appointment platform. Find the right
            doctor, book instantly.
          </p>
        </div>
        <div>
          <h4 className="font-head font-bold text-xs uppercase tracking-widest text-white/40 mb-4">
            Quick Links
          </h4>
          <div className="flex flex-col gap-2.5">
            {[
              ["/", "Home"],
              ["/hospitals", "Hospitals"],
              ["/doctors", "Doctors"],
            ].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-white/70 hover:text-green-400 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-head font-bold text-xs uppercase tracking-widest text-white/40 mb-4">
            Specialties
          </h4>
          <div className="flex flex-col gap-2.5">
            {[
              "Cardiology",
              "Neurology",
              "Orthopedics",
              "Pediatrics",
              "Dermatology",
            ].map((s) => (
              <span key={s} className="text-sm text-white/70">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/30">
        <span>© 2025 MedBook · CS5002 Software Engineering · Group 75</span>
        <span>Built with ❤️ for Nepal's Healthcare</span>
      </div>
    </footer>
  );
}
