const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const { search, city } = req.query;
    let query = 'SELECT * FROM hospitals WHERE 1=1';
    const params = [];
    if (search) { query += ' AND name LIKE ?'; params.push(`%${search}%`); }
    if (city) { query += ' AND city = ?'; params.push(city); }
    const [hospitals] = await db.execute(query, params);
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single hospital
router.get('/:id', async (req, res) => {
  try {
    const [hospitals] = await db.execute('SELECT * FROM hospitals WHERE id = ?', [req.params.id]);
    if (hospitals.length === 0) return res.status(404).json({ message: 'Hospital not found' });
    const [doctors] = await db.execute(
      'SELECT * FROM doctors WHERE hospital_id = ? AND is_active = TRUE',
      [req.params.id]
    );
    res.json({ ...hospitals[0], doctors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
