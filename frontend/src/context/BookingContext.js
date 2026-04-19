import { createContext, useContext, useState } from 'react';
import { storage } from '../utils/data';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [pendingBooking, setPendingBooking] = useState(null);

  const bookAppointment = (data) => {
    const appts = storage.getAppointments();
    const appt = {
      id: 'APT-' + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    storage.setAppointments([...appts, appt]);
    return appt;
  };

  const cancelAppointment = (id) => {
    const appts = storage.getAppointments().map(a =>
      a.id === id ? { ...a, status: 'cancelled' } : a
    );
    storage.setAppointments(appts);
  };

  const updateStatus = (id, status) => {
    const appts = storage.getAppointments().map(a =>
      a.id === id ? { ...a, status } : a
    );
    storage.setAppointments(appts);
  };

  const getBookedSlots = (doctorId, date) =>
    storage.getAppointments()
      .filter(a => a.doctorId === doctorId && a.date === date && !['cancelled','rejected'].includes(a.status))
      .map(a => a.time);

  return (
    <BookingContext.Provider value={{ pendingBooking, setPendingBooking, bookAppointment, cancelAppointment, updateStatus, getBookedSlots }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
