const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');

// eSewa Test Credentials
const ESEWA_MERCHANT_CODE = 'EPAYTEST';
const ESEWA_SECRET_KEY = '8gBm/:&EnhH.1/q';
const ESEWA_TEST_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const ESEWA_VERIFY_URL = 'https://rc-epay.esewa.com.np/api/epay/transaction/status/';

// Generate HMAC signature for eSewa
function generateSignature(message, secretKey) {
  return crypto.createHmac('sha256', secretKey).update(message).digest('base64');
}

// Initiate eSewa payment
router.post('/esewa/initiate', auth, async (req, res) => {
  try {
    const { appointment_id, amount } = req.body;
    const transactionUUID = `MEDBOOK-${appointment_id}-${Date.now()}`;
    const totalAmount = parseFloat(amount).toFixed(2);

    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUUID},product_code=${ESEWA_MERCHANT_CODE}`;
    const signature = generateSignature(message, ESEWA_SECRET_KEY);

    const paymentData = {
      amount: totalAmount,
      tax_amount: '0',
      total_amount: totalAmount,
      transaction_uuid: transactionUUID,
      product_code: ESEWA_MERCHANT_CODE,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`,
      failure_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/failure`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
    };

    // Save transaction UUID to appointment
    await db.execute(
      'UPDATE appointments SET transaction_id = ?, payment_method = "esewa" WHERE id = ?',
      [transactionUUID, appointment_id]
    );

    res.json({ paymentData, esewaUrl: ESEWA_TEST_URL });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify eSewa payment
router.post('/esewa/verify', auth, async (req, res) => {
  try {
    const { transaction_uuid, appointment_id } = req.body;

    // In production, verify with eSewa API
    // For test mode, we simulate success
    await db.execute(
      'UPDATE appointments SET payment_status = "paid", status = "confirmed" WHERE id = ? AND transaction_id = ?',
      [appointment_id, transaction_uuid]
    );

    // Notify patient
    const [appt] = await db.execute('SELECT patient_id, appointment_date FROM appointments WHERE id = ?', [appointment_id]);
    if (appt[0]) {
      await db.execute(
        `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'payment')`,
        [appt[0].patient_id, 'Payment Successful', `Your payment has been confirmed. Appointment scheduled for ${appt[0].appointment_date}.`]
      );
    }

    res.json({ message: 'Payment verified and appointment confirmed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get notifications for logged in user
router.get('/notifications', auth, async (req, res) => {
  try {
    const [notifs] = await db.execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/notifications/:id/read', auth, async (req, res) => {
  try {
    await db.execute('UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
