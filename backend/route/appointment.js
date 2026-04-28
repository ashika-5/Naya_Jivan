const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth, role } = require("../middleware/auth");

// Book appointment (patient)
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
    // Check slot availability
    const [existing] = await db.execute(
      `SELECT id FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status NOT IN ('cancelled','rejected')`,
      [doctor_id, appointment_date, appointment_time],
    );
    if (existing.length > 0)
      return res.status(400).json({ message: "This slot is already booked" });

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

    // Create notification for doctor
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

// Get patient's appointments
router.get("/my", auth, async (req, res) => {
  try {
    let query, params;
    if (req.user.role === "patient") {
      query = `SELECT a.*, d.name as doctor_name, d.specialization, d.avatar as doctor_avatar,
               h.name as hospital_name FROM appointments a
               LEFT JOIN doctors d ON a.doctor_id = d.id
               LEFT JOIN hospitals h ON a.hospital_id = h.id
               WHERE a.patient_id = ? ORDER BY a.appointment_date DESC`;
      params = [req.user.id];
    } else if (req.user.role === "doctor") {
      query = `SELECT a.*, u.name as patient_name, u.phone as patient_phone,
               h.name as hospital_name FROM appointments a
               LEFT JOIN users u ON a.patient_id = u.id
               LEFT JOIN hospitals h ON a.hospital_id = h.id
               WHERE a.doctor_id = (SELECT id FROM doctors WHERE user_id = ?)
               ORDER BY a.appointment_date DESC`;
      params = [req.user.id];
    }
    const [appointments] = await db.execute(query, params);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update appointment status (doctor)
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
      "UPDATE appointments SET status = ? WHERE id = ? AND patient_id = ?",
      ["cancelled", req.params.id, req.user.id],
    );
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update on Payment

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
qs;
nabj[an];
abort;
lbw;
sbnspjn[p];
AudioBufferSourceNode;
