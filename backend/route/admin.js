const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth, role } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// All admin routes require auth + admin role
router.use(auth, role('admin'));

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [[{ totalPatients }]] = await db.execute('SELECT COUNT(*) as totalPatients FROM users WHERE role = "patient"');
    const [[{ totalDoctors }]] = await db.execute('SELECT COUNT(*) as totalDoctors FROM doctors WHERE is_active = TRUE');
    const [[{ totalHospitals }]] = await db.execute('SELECT COUNT(*) as totalHospitals FROM hospitals');
    const [[{ totalAppointments }]] = await db.execute('SELECT COUNT(*) as totalAppointments FROM appointments');
    const [[{ pendingAppointments }]] = await db.execute('SELECT COUNT(*) as pendingAppointments FROM appointments WHERE status = "pending"');
    const [recentAppointments] = await db.execute(
      `SELECT a.*, u.name as patient_name, d.name as doctor_name, h.name as hospital_name
       FROM appointments a
       LEFT JOIN users u ON a.patient_id = u.id
       LEFT JOIN doctors d ON a.doctor_id = d.id
       LEFT JOIN hospitals h ON a.hospital_id = h.id
       ORDER BY a.created_at DESC LIMIT 10`
    );
    res.json({ totalPatients, totalDoctors, totalHospitals, totalAppointments, pendingAppointments, recentAppointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add hospital
router.post('/hospitals', async (req, res) => {
  try {
    const { name, address, city, phone, email, description, specialties } = req.body;
    const [result] = await db.execute(
      'INSERT INTO hospitals (name, address, city, phone, email, description, specialties) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, city, phone, email, description, JSON.stringify(specialties || [])]
    );
    res.json({ id: result.insertId, message: 'Hospital added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete hospital
router.delete('/hospitals/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM hospitals WHERE id = ?', [req.params.id]);
    res.json({ message: 'Hospital deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add doctor
router.post('/doctors', async (req, res) => {
  try {
    const { hospital_id, name, specialization, experience, qualification, bio, consultation_fee, available_days, available_slots, email, password } = req.body;
    let userId = null;
    if (email && password) {
      const hashed = await bcrypt.hash(password, 10);
      const [userResult] = await db.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "doctor")',
        [name, email, hashed]
      );
      userId = userResult.insertId;
    }
    const [result] = await db.execute(
      `INSERT INTO doctors (user_id, hospital_id, name, specialization, experience, qualification, bio, consultation_fee, available_days, available_slots)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, hospital_id, name, specialization, experience || 0, qualification, bio, consultation_fee || 500, JSON.stringify(available_days || []), JSON.stringify(available_slots || [])]
    );
    res.json({ id: result.insertId, message: 'Doctor added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete doctor
router.delete('/doctors/:id', async (req, res) => {
  try {
    await db.execute('UPDATE doctors SET is_active = FALSE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Doctor removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.execute('SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get notifications for any user (admin can see all)
router.get('/notifications', async (req, res) => {
  try {
    const [notifs] = await db.execute('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
