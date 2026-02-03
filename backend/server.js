import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  SHORTCODE,
  PASSKEY,
  CALLBACK_URL,
  PORT,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS
} = process.env;

// Validate required env variables
['CONSUMER_KEY', 'CONSUMER_SECRET', 'SHORTCODE', 'PASSKEY', 'CALLBACK_URL'].forEach(key => {
  if (!process.env[key]) throw new Error(`❌ Missing env: ${key}`);
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: false,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// In-memory store
const payments = {}; // 'pending' | 'success' | 'failed' | 'cancelled'
const reservations = {}; // { phone, email }

// Helpers
const normalizePhone = (phone) => {
  phone = phone.replace(/\s+/g, '');
  if (phone.startsWith('+')) return phone.substring(1);
  if (phone.startsWith('0')) return '254' + phone.substring(1);
  if (phone.startsWith('7')) return '254' + phone;
  return phone;
};

const getTimestamp = () => {
  const d = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
};

// Access token
async function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  const res = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${auth}` }
  });
  return res.data.access_token;
}

// STK Push endpoint
app.post('/api/stkpush', async (req, res) => {
  try {
    const { phone, amount, email } = req.body;
    if (!phone || !amount || !email) return res.status(400).json({ error: 'Phone, email, amount required' });

    const token = await getAccessToken();
    const timestamp = getTimestamp();
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: normalizePhone(phone),
      PartyB: SHORTCODE,
      PhoneNumber: normalizePhone(phone),
      CallBackURL: CALLBACK_URL,
      AccountReference: 'Malivere',
      TransactionDesc: 'Reservation Payment',
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.ResponseCode !== '0') return res.status(400).json(response.data);

    const checkoutRequestID = response.data.CheckoutRequestID;
    payments[checkoutRequestID] = 'pending';
    reservations[checkoutRequestID] = { phone, email };

    console.log('✅ STK Push sent:', checkoutRequestID);
    res.json({ checkoutRequestID });

  } catch (err) {
    console.error('❌ STK Error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Callback endpoint
app.post('/callback', async (req, res) => {
  try {
    const callback = req.body?.Body?.stkCallback;
    if (!callback) return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });

    const checkoutId = callback.CheckoutRequestID;
    const reservation = reservations[checkoutId];

    switch (callback.ResultCode) {
      case 0:
        payments[checkoutId] = 'success';
        const metadata = callback.CallbackMetadata?.Item || [];
        const amount = metadata.find(i => i.Name === 'Amount')?.Value;
        const receipt = metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
        console.log('✅ Payment success:', receipt);

        if (reservation?.email) {
          await transporter.sendMail({
            from: `"Malivère" <${SMTP_USER}>`,
            to: reservation.email,
            subject: 'Payment Receipt',
            text: `Reservation Confirmed.\nAmount: ${amount} KES\nReceipt: ${receipt}\nThank you!`
          });
          console.log('✅ Receipt email sent');
        }
        break;

      case 1032: // Cancelled by user
        payments[checkoutId] = 'cancelled';
        console.log('❌ Payment cancelled by user:', checkoutId);
        break;

      default:
        payments[checkoutId] = 'failed';
        console.log('❌ Payment failed:', callback.ResultDesc);
    }

    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });

  } catch (err) {
    console.error('Callback error:', err);
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
});

// Payment status
app.get('/api/payment-status/:id', (req, res) => {
  const status = payments[req.params.id] || 'pending';
  res.json({ status });
});

// Start server
app.listen(PORT || 5000, () => console.log(`🚀 Server running on port ${PORT || 5000}`));
