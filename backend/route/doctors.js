const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all doctors with filters
router.get('/', async (req, res) => {
  try {
    const { search, specialization, hospital_id } = req.query;
    let query = `
      SELECT d.*, h.name as hospital_name, h.city as hospital_city
      FROM doctors d
      LEFT JOIN hospitals h ON d.hospital_id = h.id
      WHERE d.is_active = TRUE
    `;
    const params = [];
    if (search) { query += ' AND d.name LIKE ?'; params.push(`%${search}%`); }
    if (specialization) { query += ' AND d.specialization = ?'; params.push(specialization); }
    if (hospital_id) { query += ' AND d.hospital_id = ?'; params.push(hospital_id); }
    const [doctors] = await db.execute(query, params);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single doctor
router.get('/:id', async (req, res) => {
  try {
    const [doctors] = await db.execute(
      `SELECT d.*, h.name as hospital_name, h.address as hospital_address, h.city as hospital_city
       FROM doctors d LEFT JOIN hospitals h ON d.hospital_id = h.id WHERE d.id = ?`,
      [req.params.id]
    );
    if (doctors.length === 0) return res.status(404).json({ message: 'Doctor not found' });
    const [reviews] = await db.execute(
      `SELECT r.*, u.name as patient_name FROM reviews r
       LEFT JOIN users u ON r.patient_id = u.id
       WHERE r.doctor_id = ? ORDER BY r.created_at DESC LIMIT 5`,
      [req.params.id]
    );
    res.json({ ...doctors[0], reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get booked slots for a doctor on a specific date
router.get('/:id/slots', async (req, res) => {
  try {
    const { date } = req.query;
    const [booked] = await db.execute(
      `SELECT appointment_time FROM appointments
       WHERE doctor_id = ? AND appointment_date = ? AND status NOT IN ('cancelled','rejected')`,
      [req.params.id, date]
    );
    res.json(booked.map(b => b.appointment_time));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all specializations
router.get('/meta/specializations', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT DISTINCT specialization FROM doctors WHERE is_active = TRUE');
    res.json(rows.map(r => r.specialization));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
