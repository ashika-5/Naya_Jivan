// ─── MOCK DATA ────────────────────────────────────────────────
export const HOSPITALS = [
  {
    id: 1,
    name: "Bir Hospital",
    address: "Mahaboudha, Kathmandu",
    city: "Kathmandu",
    phone: "01-4221988",
    email: "info@birhospital.gov.np",
    description:
      "One of the oldest and largest government hospitals in Nepal providing comprehensive medical care with over 700 beds and cutting-edge departments.",
    rating: 4.2,
    total_doctors: 45,
    specialties: [
      "Cardiology",
      "Neurology",
      "Orthopedics",
      "Pediatrics",
      "General Surgery",
    ],
    emoji: "🏛️",
    theme: "from-green-50 to-green-100",
  },
  {
    id: 2,
    name: "Patan Hospital",
    address: "Lagankhel, Lalitpur",
    city: "Lalitpur",
    phone: "01-5522278",
    email: "info@patanhospital.org",
    description:
      "A leading non-profit hospital known for its community-focused healthcare and high patient satisfaction. Trusted for 40+ years.",
    rating: 4.5,
    total_doctors: 38,
    specialties: [
      "Internal Medicine",
      "Gynecology",
      "Dermatology",
      "ENT",
      "Ophthalmology",
    ],
    emoji: "⚕️",
    theme: "from-sky-50 to-blue-100",
  },
  {
    id: 3,
    name: "Grande International",
    address: "Dhapasi, Kathmandu",
    city: "Kathmandu",
    phone: "01-5159266",
    email: "info@grande.com.np",
    description:
      "State-of-the-art multi-specialty hospital with cutting-edge technology and international standard care across 30+ departments.",
    rating: 4.7,
    total_doctors: 62,
    specialties: [
      "Oncology",
      "Cardiology",
      "Neurosurgery",
      "Transplant",
      "Plastic Surgery",
    ],
    emoji: "🏥",
    theme: "from-pink-50 to-rose-100",
  },
  {
    id: 4,
    name: "Teaching Hospital (IOM)",
    address: "Maharajgunj, Kathmandu",
    city: "Kathmandu",
    phone: "01-4412303",
    email: "info@iom.edu.np",
    description:
      "Institute of Medicine teaching hospital. A premier centre for medical education and patient care with highly qualified specialists.",
    rating: 4.3,
    total_doctors: 55,
    specialties: ["All Specialties", "Research", "Emergency Medicine"],
    emoji: "🎓",
    theme: "from-amber-50 to-yellow-100",
  },
  {
    id: 5,
    name: "Norvic International",
    address: "Thapathali, Kathmandu",
    city: "Kathmandu",
    phone: "01-4258554",
    email: "info@norvic.com.np",
    description:
      "Premium private hospital offering international standard healthcare. Known for advanced cardiac surgery and IVF treatments.",
    rating: 4.6,
    total_doctors: 40,
    specialties: [
      "Cardiac Surgery",
      "IVF",
      "Bariatric Surgery",
      "Robotic Surgery",
    ],
    emoji: "✨",
    theme: "from-violet-50 to-purple-100",
  },
];

export const DOCTORS = [
  {
    id: 1,
    hospital_id: 1,
    name: "Dr. Rajesh Sharma",
    specialization: "Cardiologist",
    experience: 15,
    qualification: "MBBS, MD Cardiology",
    bio: "Senior cardiologist with expertise in interventional cardiology and heart failure management. Has performed over 1000 cardiac catheterization procedures and is a faculty member at the Institute of Medicine.",
    rating: 4.8,
    consultation_fee: 1500,
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    available_slots: [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
    ],
    hospital_name: "Bir Hospital",
    initials: "RS",
    color: "bg-green-50 text-green-800",
  },
  {
    id: 2,
    hospital_id: 1,
    name: "Dr. Sushila Karki",
    specialization: "Neurologist",
    experience: 12,
    qualification: "MBBS, MD Neurology, DM",
    bio: "Expert in treating neurological disorders including epilepsy, stroke rehabilitation and Parkinson disease. Published researcher in neuroscience with 20+ peer-reviewed papers.",
    rating: 4.6,
    consultation_fee: 1200,
    available_days: ["Monday", "Wednesday", "Friday"],
    available_slots: [
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "15:00",
      "15:30",
      "16:00",
    ],
    hospital_name: "Bir Hospital",
    initials: "SK",
    color: "bg-blue-50 text-blue-800",
  },
  {
    id: 3,
    hospital_id: 2,
    name: "Dr. Binod Thapa",
    specialization: "Orthopedic Surgeon",
    experience: 18,
    qualification: "MBBS, MS Orthopedics",
    bio: "Specialized in joint replacement, sports injuries and spine surgery. Pioneer in minimally invasive orthopedic techniques in Nepal with 2000+ successful surgeries.",
    rating: 4.7,
    consultation_fee: 1800,
    available_days: ["Tuesday", "Thursday", "Saturday"],
    available_slots: [
      "09:00",
      "09:30",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
    ],
    hospital_name: "Patan Hospital",
    initials: "BT",
    color: "bg-amber-50 text-amber-800",
  },
  {
    id: 4,
    hospital_id: 2,
    name: "Dr. Anita Pradhan",
    specialization: "Gynecologist",
    experience: 10,
    qualification: "MBBS, MD OBG",
    bio: "Experienced gynecologist specializing in high-risk pregnancies and laparoscopic gynecological surgery. Passionate about maternal health and women's wellness in Nepal.",
    rating: 4.9,
    consultation_fee: 1000,
    available_days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    available_slots: [
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "14:00",
      "14:30",
      "15:00",
    ],
    hospital_name: "Patan Hospital",
    initials: "AP",
    color: "bg-pink-50 text-pink-800",
  },
  {
    id: 5,
    hospital_id: 3,
    name: "Dr. Subash Acharya",
    specialization: "Oncologist",
    experience: 20,
    qualification: "MBBS, MD Oncology, PhD",
    bio: "Pioneer in cancer treatment using latest chemotherapy and immunotherapy protocols. Heads the cancer research unit at Grande and has trained dozens of oncologists across Nepal.",
    rating: 4.8,
    consultation_fee: 2500,
    available_days: ["Monday", "Wednesday", "Thursday"],
    available_slots: ["10:00", "11:00", "14:00", "15:00", "16:00"],
    hospital_name: "Grande International",
    initials: "SA",
    color: "bg-red-50 text-red-800",
  },
  {
    id: 6,
    hospital_id: 3,
    name: "Dr. Priya Joshi",
    specialization: "Dermatologist",
    experience: 8,
    qualification: "MBBS, MD Dermatology",
    bio: "Expert in skin disorders, cosmetic dermatology and trichology. Uses the latest laser and aesthetic treatments. Trained at AIIMS Delhi and has a special interest in hair restoration.",
    rating: 4.5,
    consultation_fee: 800,
    available_days: ["Monday", "Tuesday", "Thursday", "Friday"],
    available_slots: [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "16:00",
      "16:30",
    ],
    hospital_name: "Grande International",
    initials: "PJ",
    color: "bg-violet-50 text-violet-800",
  },
  {
    id: 7,
    hospital_id: 4,
    name: "Dr. Nabin Gautam",
    specialization: "Pediatrician",
    experience: 14,
    qualification: "MBBS, MD Pediatrics",
    bio: "Child health specialist with focus on neonatal care and pediatric infectious diseases. Warm and approachable with children, making him one of the most sought-after pediatricians in Kathmandu.",
    rating: 4.7,
    consultation_fee: 900,
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    available_slots: [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
    ],
    hospital_name: "Teaching Hospital (IOM)",
    initials: "NG",
    color: "bg-teal-50 text-teal-800",
  },
  {
    id: 8,
    hospital_id: 5,
    name: "Dr. Ritu Shrestha",
    specialization: "Cardiac Surgeon",
    experience: 22,
    qualification: "MBBS, MS, MCh Cardiac Surgery",
    bio: "Highly skilled cardiac surgeon with 500+ successful open heart surgeries. First female cardiac surgeon to perform robotic heart surgery in Nepal. Trained at Cleveland Clinic, USA.",
    rating: 5.0,
    consultation_fee: 3000,
    available_days: ["Tuesday", "Thursday"],
    available_slots: ["10:00", "11:00", "14:00", "15:00"],
    hospital_name: "Norvic International",
    initials: "RS",
    color: "bg-sky-50 text-sky-800",
  },
];

// ─── STORAGE HELPERS ──────────────────────────────────────────
const get = (k, def) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? def;
  } catch {
    return def;
  }
};
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export const storage = {
  getAppointments: () => get("mb_appts", []),
  setAppointments: (v) => set("mb_appts", v),
  getNotifications: () => get("mb_notifs", []),
  setNotifications: (v) => set("mb_notifs", v),
  getUsers: () => get("mb_users", []),
  setUsers: (v) => set("mb_users", v),
  getUser: () => get("mb_user", null),
  setUser: (v) => set("mb_user", v),
  clearUser: () => localStorage.removeItem("mb_user"),
};

// ─── AUTH HELPERS ─────────────────────────────────────────────
export function login(email, password) {
  if (email === "admin@medbook.com" && password === "admin123")
    return { id: 0, name: "Administrator", email, role: "admin" };
  if (email === "doctor@medbook.com" && password === "doctor123")
    return {
      id: -1,
      name: "Dr. Rajesh Sharma",
      email,
      role: "doctor",
      doctorId: 1,
    };
  const users = storage.getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return null;
  const { password: _, ...safe } = user;
  return safe;
}

export function register(name, email, phone, password) {
  const users = storage.getUsers();
  if (users.find((u) => u.email === email))
    throw new Error("Email already registered");
  const user = {
    id: Date.now(),
    name,
    email,
    phone,
    password,
    role: "patient",
  };
  storage.setUsers([...users, user]);
  const { password: _, ...safe } = user;
  return safe;
}

// ─── NOTIFICATION HELPER ──────────────────────────────────────
export function pushNotification(userId, title, message, type = "appointment") {
  const notifs = storage.getNotifications();
  const n = {
    id: Date.now(),
    userId,
    title,
    message,
    type,
    read: false,
    time: new Date().toISOString(),
  };
  storage.setNotifications([...notifs, n]);
  return n;
}
