const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth, role } = require("../middleware/auth");

// Book appointment (patient only)
router.post("/", auth, role("patient"), async (req, res) => {
  try {
    const {
      doctor_id,
      hospital_id,
      appointment_date,
      appointment_time,
      notes,
      amount,
    } = req.body;

    // Check slot availability — no double booking
    const [existing] = await db.execute(
      `SELECT id FROM appointments
       WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?
       AND status NOT IN ('cancelled','rejected')`,
      [doctor_id, appointment_date, appointment_time],
    );
    if (existing.length > 0)
      return res.status(400).json({
        message:
          "This time slot is already booked. Please choose another slot.",
      });

    const [result] = await db.execute(
      `INSERT INTO appointments (patient_id, doctor_id, hospital_id, appointment_date, appointment_time, notes, amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        req.user.id,
        doctor_id,
        hospital_id,
        appointment_date,
        appointment_time,
        notes || null,
        amount,
      ],
    );

    // Notify doctor if they have a user account
    const [doctor] = await db.execute(
      "SELECT user_id, name FROM doctors WHERE id = ?",
      [doctor_id],
    );
    if (doctor[0]?.user_id) {
      await db.execute(
        `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'appointment')`,
        [
          doctor[0].user_id,
          "New Appointment Request",
          `You have a new appointment request for ${appointment_date} at ${appointment_time}`,
        ],
      );
    }

    res.json({
      id: result.insertId,
      message: "Appointment booked successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get appointments for the logged-in user (patient or doctor)
router.get("/my", auth, async (req, res) => {
  try {
    let query, params;
    if (req.user.role === "patient") {
      query = `
        SELECT a.*, d.name as doctor_name, d.specialization, d.avatar as doctor_avatar,
               h.name as hospital_name
        FROM appointments a
        LEFT JOIN doctors d ON a.doctor_id = d.id
        LEFT JOIN hospitals h ON a.hospital_id = h.id
        WHERE a.patient_id = ?
        ORDER BY a.appointment_date DESC`;
      params = [req.user.id];
    } else if (req.user.role === "doctor") {
      query = `
        SELECT a.*, u.name as patient_name, u.phone as patient_phone,
               h.name as hospital_name
        FROM appointments a
        LEFT JOIN users u ON a.patient_id = u.id
        LEFT JOIN hospitals h ON a.hospital_id = h.id
        WHERE a.doctor_id = (SELECT id FROM doctors WHERE user_id = ?)
        ORDER BY a.appointment_date DESC`;
      params = [req.user.id];
    } else {
      // Admin can see all
      query = `
        SELECT a.*, u.name as patient_name, d.name as doctor_name, h.name as hospital_name
        FROM appointments a
        LEFT JOIN users u ON a.patient_id = u.id
        LEFT JOIN doctors d ON a.doctor_id = d.id
        LEFT JOIN hospitals h ON a.hospital_id = h.id
        ORDER BY a.created_at DESC`;
      params = [];
    }
    const [appointments] = await db.execute(query, params);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update appointment status (doctor or admin)
router.patch("/:id/status", auth, role("doctor", "admin"), async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute("UPDATE appointments SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);

    // Notify patient
    const [appt] = await db.execute(
      "SELECT patient_id, appointment_date, appointment_time FROM appointments WHERE id = ?",
      [req.params.id],
    );
    if (appt[0]) {
      const msg =
        status === "confirmed"
          ? `Your appointment on ${appt[0].appointment_date} at ${appt[0].appointment_time} has been confirmed!`
          : `Your appointment on ${appt[0].appointment_date} has been ${status}.`;
      await db.execute(
        `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'appointment')`,
        [
          appt[0].patient_id,
          `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          msg,
        ],
      );
    }
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel appointment (patient)
router.patch("/:id/cancel", auth, role("patient"), async (req, res) => {
  try {
    await db.execute(
      "UPDATE appointments SET status = 'cancelled' WHERE id = ? AND patient_id = ?",
      [req.params.id, req.user.id],
    );
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update payment info
router.patch("/:id/payment", auth, async (req, res) => {
  try {
    const { payment_status, payment_method, transaction_id } = req.body;
    await db.execute(
      "UPDATE appointments SET payment_status = ?, payment_method = ?, transaction_id = ? WHERE id = ?",
      [payment_status, payment_method, transaction_id, req.params.id],
    );
    res.json({ message: "Payment updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
