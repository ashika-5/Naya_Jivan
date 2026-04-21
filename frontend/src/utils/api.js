/**
 * api.js  —  Live backend API client
 *
 * This file mirrors every function in data.js but uses real
 * Axios calls to the Express backend instead of localStorage.
 *
 * To switch a page from mock → live:
 *   Change:   import { ... } from '../utils/data'
 *   To:       import { ... } from '../utils/api'
 *
 * The Vite proxy in vite.config.js forwards /api → http://localhost:5000
 */

import axios from "axios";

// ─── HTTP CLIENT ──────────────────────────────────────────────
const http = axios.create({ baseURL: "/api" });

// Attach JWT from localStorage to every request
http.interceptors.request.use((cfg) => {
  const user = JSON.parse(localStorage.getItem("mb_user") || "null");
  if (user?.token) cfg.headers.Authorization = `Bearer ${user.token}`;
  return cfg;
});

// ─── AUTH ─────────────────────────────────────────────────────
export async function loginAPI(email, password) {
  const { data } = await http.post("/auth/login", { email, password });
  // Store token alongside user object
  localStorage.setItem(
    "mb_user",
    JSON.stringify({ ...data.user, token: data.token }),
  );
  return data.user;
}

export async function registerAPI(name, email, phone, password) {
  const { data } = await http.post("/auth/register", {
    name,
    email,
    phone,
    password,
  });
  localStorage.setItem(
    "mb_user",
    JSON.stringify({ ...data.user, token: data.token }),
  );
  return data.user;
}

export async function getMe() {
  const { data } = await http.get("/auth/me");
  return data;
}

// ─── HOSPITALS ────────────────────────────────────────────────
export async function fetchHospitals(params = {}) {
  const { data } = await http.get("/hospitals", { params });
  return data;
}

export async function fetchHospital(id) {
  const { data } = await http.get(`/hospitals/${id}`);
  return data;
}

// ─── DOCTORS ──────────────────────────────────────────────────
export async function fetchDoctors(params = {}) {
  const { data } = await http.get("/doctors", { params });
  return data;
}

export async function fetchDoctor(id) {
  const { data } = await http.get(`/doctors/${id}`);
  return data;
}

export async function fetchBookedSlots(doctorId, date) {
  const { data } = await http.get(`/doctors/${doctorId}/slots`, {
    params: { date },
  });
  return data; // string[]
}

export async function fetchSpecializations() {
  const { data } = await http.get("/doctors/meta/specializations");
  return data;
}

// ─── APPOINTMENTS ─────────────────────────────────────────────
export async function bookAppointmentAPI(payload) {
  const { data } = await http.post("/appointments", payload);
  return data;
}

export async function fetchMyAppointments() {
  const { data } = await http.get("/appointments/my");
  return data;
}

export async function cancelAppointmentAPI(id) {
  const { data } = await http.patch(`/appointments/${id}/cancel`);
  return data;
}

export async function updateAppointmentStatus(id, status) {
  const { data } = await http.patch(`/appointments/${id}/status`, { status });
  return data;
}

export async function updatePayment(id, payload) {
  const { data } = await http.patch(`/appointments/${id}/payment`, payload);
  return data;
}

// ─── PAYMENT ──────────────────────────────────────────────────
export async function initiateEsewa(appointment_id, amount) {
  const { data } = await http.post("/payment/esewa/initiate", {
    appointment_id,
    amount,
  });
  return data; // { paymentData, esewaUrl }
}

export async function verifyEsewa(transaction_uuid, appointment_id) {
  const { data } = await http.post("/payment/esewa/verify", {
    transaction_uuid,
    appointment_id,
  });
  return data;
}

// ─── NOTIFICATIONS ────────────────────────────────────────────
export async function fetchNotifications() {
  const { data } = await http.get("/payment/notifications");
  return data;
}

export async function markNotificationRead(id) {
  const { data } = await http.patch(`/payment/notifications/${id}/read`);
  return data;
}

// ─── ADMIN ────────────────────────────────────────────────────
export async function fetchAdminStats() {
  const { data } = await http.get("/admin/stats");
  return data;
}

export async function addHospital(payload) {
  const { data } = await http.post("/admin/hospitals", payload);
  return data;
}

export async function removeHospital(id) {
  const { data } = await http.delete(`/admin/hospitals/${id}`);
  return data;
}

export async function addDoctor(payload) {
  const { data } = await http.post("/admin/doctors", payload);
  return data;
}

export async function removeDoctor(id) {
  const { data } = await http.delete(`/admin/doctors/${id}`);
  return data;
}

export async function fetchAllUsers() {
  const { data } = await http.get("/admin/users");
  return data;
}
