const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");

// Create payment
router.post("/", auth, async (req, res) => {
  try {
    const { appointment_id, amount, payment_method } = req.body;

    if (!appointment_id || !amount || !payment_method) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify appointment exists
    const [appointments] = await db.execute(
      "SELECT * FROM appointments WHERE id = ? AND patient_id = ?",
      [appointment_id, req.user.id],
    );

    if (appointments.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update appointment payment status
    const [result] = await db.execute(
      "UPDATE appointments SET payment_status = ?, payment_method = ?, status = ? WHERE id = ?",
      [
        payment_method === "esewa" ? "paid" : "unpaid",
        payment_method,
        payment_method === "esewa" ? "confirmed" : "pending",
        appointment_id,
      ],
    );

    res.json({
      message: "Payment processed successfully",
      appointment_id,
      payment_method,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get payment history
router.get("/history", auth, async (req, res) => {
  try {
    const [payments] = await db.execute(
      `SELECT a.id, a.appointment_date, a.appointment_time, a.amount,
              a.payment_status, a.payment_method, d.name as doctor_name,
              h.name as hospital_name
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       JOIN hospitals h ON a.hospital_id = h.id
       WHERE a.patient_id = ?
       ORDER BY a.created_at DESC`,
      [req.user.id],
    );

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
