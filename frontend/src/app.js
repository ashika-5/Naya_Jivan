import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Hospitals from "./pages/Hospitals";
import HospitalDetail from "./pages/HospitalDetail";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import Notifications from "./pages/Notifications";

import "./styles/index.css";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/hospitals/:id" element={<HospitalDetail />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:id" element={<DoctorDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: "DM Sans, sans-serif",
                fontSize: "14px",
                borderRadius: "12px",
                background: "#1a1a18",
                color: "#fff",
                padding: "14px 18px",
              },
              success: { iconTheme: { primary: "#1D9E75", secondary: "#fff" } },
            }}
          />
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
