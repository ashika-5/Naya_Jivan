import { createContext, useContext, useState } from "react";
import {
  bookAppointmentAPI,
  cancelAppointmentAPI,
  updateAppointmentStatus,
  fetchBookedSlots,
} from "../utils/api";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [pendingBooking, setPendingBooking] = useState(null);

  const bookAppointment = async (data) => {
    const result = await bookAppointmentAPI({
      doctor_id: data.doctorId,
      hospital_id: data.hospitalId,
      appointment_date: data.date,
      appointment_time: data.time,
      notes: data.notes || null,
      amount: data.amount,
    });
    return result;
  };

  const cancelAppointment = async (id) => {
    await cancelAppointmentAPI(id);
  };

  const updateStatus = async (id, status) => {
    await updateAppointmentStatus(id, status);
  };

  const getBookedSlots = async (doctorId, date) => {
    return await fetchBookedSlots(doctorId, date);
  };

  return (
    <BookingContext.Provider
      value={{
        pendingBooking,
        setPendingBooking,
        bookAppointment,
        cancelAppointment,
        updateStatus,
        getBookedSlots,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
