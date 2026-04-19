import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Modal, Btn, Input } from "./UI";
import toast from "react-hot-toast";

export default function AuthModal() {
  const { authModal, setAuthModal, login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(
    authModal === "register" ? "register" : "login",
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleLogin = async () => {
    if (!form.email || !form.password) return toast.error("Fill all fields");
    setLoading(true);
    try {
      login(form.email, form.password);
      setAuthModal(null);
      toast.success("Welcome back! 👋");
      navigate("/dashboard");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password)
      return toast.error("Fill all required fields");
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      register(form.name, form.email, form.phone, form.password);
      setAuthModal(null);
      toast.success(`Welcome to MedBook, ${form.name.split(" ")[0]}! 🎉`);
      navigate("/dashboard");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={!!authModal} onClose={() => setAuthModal(null)}>
      {/* Tabs */}
      <div className="flex bg-cream-dark rounded-xl p-1 mb-7">
        {["login", "register"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-[10px] text-sm font-medium font-body transition-all duration-150 ${tab === t ? "bg-white text-ink shadow-sm" : "text-[var(--muted)]"}`}
          >
            {t === "login" ? "Log In" : "Create Account"}
          </button>
        ))}
      </div>

      {tab === "login" ? (
        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={f("email")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            value={form.password}
            onChange={f("password")}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <Btn
            className="w-full justify-center mt-1 py-3"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In"}
          </Btn>
          <p className="text-center text-xs text-[var(--muted)] mt-1">
            Demo: <strong>admin@medbook.com</strong> / admin123
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Input
            label="Full Name *"
            placeholder="Your full name"
            value={form.name}
            onChange={f("name")}
          />
          <Input
            label="Email *"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={f("email")}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="98XXXXXXXX"
            value={form.phone}
            onChange={f("phone")}
          />
          <Input
            label="Password *"
            type="password"
            placeholder="Min 6 characters"
            value={form.password}
            onChange={f("password")}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
          <Btn
            className="w-full justify-center mt-1 py-3"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account"}
          </Btn>
        </div>
      )}

      <div className="text-center mt-4">
        <button
          className="text-xs text-[var(--muted)] underline"
          onClick={() => setAuthModal(null)}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
