import { useState, useEffect } from "react";
import { fetchAdminStats, addDoctor, removeDoctor, addHospital, removeHospital, fetchAllUsers } from "../utils/api";
import toast from "react-hot-toast";

function StatCard({ icon, num, label, color }) {
  return (
    <div className={`rounded-xl p-5 text-white ${color}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-head font-bold text-3xl">{num}</div>
      <div className="text-sm opacity-80 mt-1">{label}</div>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[var(--muted)]">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="border border-[rgba(0,0,0,0.12)] rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition-colors" />
    </div>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [doc, setDoc] = useState({
    name:"", email:"", password:"", specialization:"", experience:"",
    qualification:"", bio:"", consultation_fee:"", hospital_id:"",
    available_days:"Monday,Tuesday,Wednesday,Thursday,Friday",
    available_slots:"09:00,09:30,10:00,10:30,11:00,14:00,14:30,15:00",
  });

  const [hosp, setHosp] = useState({ name:"", address:"", city:"", phone:"", email:"", description:"" });

  const loadStats = async () => {
    try {
      const [s, u] = await Promise.all([fetchAdminStats(), fetchAllUsers()]);
      setStats(s); setUsers(u);
    } catch (e) { toast.error("Could not load admin data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadStats(); }, []);

  const handleAddDoctor = async () => {
    if (!doc.name || !doc.specialization || !doc.hospital_id) return toast.error("Name, specialization and Hospital ID are required");
    try {
      await addDoctor({
        ...doc,
        experience: Number(doc.experience) || 0,
        consultation_fee: Number(doc.consultation_fee) || 500,
        available_days: doc.available_days.split(",").map(s => s.trim()),
        available_slots: doc.available_slots.split(",").map(s => s.trim()),
      });
      toast.success("Doctor added!");
      setDoc({ name:"",email:"",password:"",specialization:"",experience:"",qualification:"",bio:"",consultation_fee:"",hospital_id:"",available_days:"Monday,Tuesday,Wednesday,Thursday,Friday",available_slots:"09:00,09:30,10:00,10:30,11:00,14:00,14:30,15:00" });
      loadStats();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to add doctor"); }
  };

  const handleAddHospital = async () => {
    if (!hosp.name || !hosp.address || !hosp.city) return toast.error("Name, address and city are required");
    try {
      await addHospital(hosp);
      toast.success("Hospital added!");
      setHosp({ name:"",address:"",city:"",phone:"",email:"",description:"" });
      loadStats();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to add hospital"); }
  };

  if (loading) return <div className="text-center py-20 text-[var(--muted)]">Loading dashboard…</div>;

  const dField = k => e => setDoc(p => ({ ...p, [k]: e.target.value }));
  const hField = k => e => setHosp(p => ({ ...p, [k]: e.target.value }));
  const tabs = ["overview","add-doctor","add-hospital","users"];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-head font-extrabold text-2xl mb-1">Admin Dashboard</h1>
        <p className="text-sm text-[var(--muted)]">Manage the entire hospital system</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? "bg-green-500 text-white" : "bg-white border border-[rgba(0,0,0,0.1)] text-[var(--muted)] hover:text-ink"}`}>
            {t === "add-doctor" ? "Add Doctor" : t === "add-hospital" ? "Add Hospital" : t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "overview" && stats && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="👤" num={stats.totalPatients}     label="Total Patients"     color="bg-green-500" />
            <StatCard icon="🩺" num={stats.totalDoctors}      label="Active Doctors"     color="bg-blue-500" />
            <StatCard icon="🏥" num={stats.totalHospitals}    label="Hospitals"          color="bg-violet-500" />
            <StatCard icon="📅" num={stats.totalAppointments} label="Appointments"       color="bg-amber-500" />
          </div>
          <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)] p-5">
            <h2 className="font-head font-bold text-lg mb-4">Recent Appointments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-[var(--muted)] border-b border-[rgba(0,0,0,0.07)]">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Doctor</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {stats.recentAppointments?.map(a => (
                    <tr key={a.id} className="border-b border-[rgba(0,0,0,0.04)] last:border-0">
                      <td className="py-3">{a.patient_name}</td>
                      <td className="py-3">{a.doctor_name}</td>
                      <td className="py-3">{a.appointment_date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status==="confirmed"?"bg-green-100 text-green-700":a.status==="pending"?"bg-amber-100 text-amber-700":a.status==="completed"?"bg-blue-100 text-blue-700":"bg-red-100 text-red-700"}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "add-doctor" && (
        <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)] p-6">
          <h2 className="font-head font-bold text-lg mb-5">Add New Doctor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Full Name *"       value={doc.name}            onChange={dField("name")}            placeholder="Dr. John Doe" />
            <FormInput label="Specialization *"  value={doc.specialization}  onChange={dField("specialization")}  placeholder="Cardiologist" />
            <FormInput label="Hospital ID *"     value={doc.hospital_id}     onChange={dField("hospital_id")}     placeholder="1" type="number" />
            <FormInput label="Experience (yrs)"  value={doc.experience}      onChange={dField("experience")}      placeholder="10" type="number" />
            <FormInput label="Qualification"     value={doc.qualification}   onChange={dField("qualification")}   placeholder="MBBS, MD" />
            <FormInput label="Consultation Fee"  value={doc.consultation_fee} onChange={dField("consultation_fee")} placeholder="1000" type="number" />
            <FormInput label="Login Email"       value={doc.email}           onChange={dField("email")}           placeholder="doctor@email.com" type="email" />
            <FormInput label="Login Password"    value={doc.password}        onChange={dField("password")}        placeholder="Min 6 chars" type="password" />
            <div className="md:col-span-2">
              <FormInput label="Available Days (comma-separated)"  value={doc.available_days}  onChange={dField("available_days")}  placeholder="Monday,Tuesday,Wednesday" />
            </div>
            <div className="md:col-span-2">
              <FormInput label="Available Slots (comma-separated)" value={doc.available_slots} onChange={dField("available_slots")} placeholder="09:00,09:30,10:00" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-medium text-[var(--muted)]">Bio</label>
              <textarea value={doc.bio} onChange={dField("bio")} rows={3} placeholder="Short bio..."
                className="border border-[rgba(0,0,0,0.12)] rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition-colors resize-none" />
            </div>
          </div>
          <button onClick={handleAddDoctor}
            className="mt-5 px-6 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
            Add Doctor
          </button>
        </div>
      )}

      {tab === "add-hospital" && (
        <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)] p-6">
          <h2 className="font-head font-bold text-lg mb-5">Add New Hospital</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Hospital Name *" value={hosp.name}        onChange={hField("name")}        placeholder="Bir Hospital" />
            <FormInput label="City *"          value={hosp.city}        onChange={hField("city")}        placeholder="Kathmandu" />
            <FormInput label="Address *"       value={hosp.address}     onChange={hField("address")}     placeholder="Mahaboudha, Kathmandu" />
            <FormInput label="Phone"           value={hosp.phone}       onChange={hField("phone")}       placeholder="01-4221988" />
            <FormInput label="Email"           value={hosp.email}       onChange={hField("email")}       placeholder="info@hospital.com" type="email" />
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-medium text-[var(--muted)]">Description</label>
              <textarea value={hosp.description} onChange={hField("description")} rows={3}
                placeholder="About this hospital..."
                className="border border-[rgba(0,0,0,0.12)] rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition-colors resize-none" />
            </div>
          </div>
          <button onClick={handleAddHospital}
            className="mt-5 px-6 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
            Add Hospital
          </button>
        </div>
      )}

      {tab === "users" && (
        <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)] p-5">
          <h2 className="font-head font-bold text-lg mb-4">All Users ({users.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[var(--muted)] border-b border-[rgba(0,0,0,0.07)]">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium">Joined</th>
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-[rgba(0,0,0,0.04)] last:border-0">
                    <td className="py-3 font-medium">{u.name}</td>
                    <td className="py-3 text-[var(--muted)]">{u.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role==="admin"?"bg-violet-100 text-violet-700":u.role==="doctor"?"bg-blue-100 text-blue-700":"bg-green-100 text-green-700"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-[var(--muted)]">{u.phone || "—"}</td>
                    <td className="py-3 text-[var(--muted)]">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
