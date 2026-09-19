// Vercel Serverless Function: /api/book
// Dispatches appointment alert to Staff Telegram Group & confirms booking

const https = require('https');

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const {
      serviceName,
      servicePrice,
      branch = 'Battambang Main Studio',
      date,
      timeSlot,
      specialist = 'Any Available Stylist',
      customerName,
      customerPhone,
      customerTelegram = '',
      notes = '',
      paymentMethod = 'Pay at Counter (Cash / KHQR)'
    } = req.body || {};

    // Validate required fields
    if (!customerName || !customerPhone || !serviceName || !date || !timeSlot) {
      return res.status(400).json({
        error: 'Please fill in all required fields: name, phone, service, date, and time slot.'
      });
    }

    // Generate unique booking reference code (e.g. AUR-7821)
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingId = `AUR-${randomCode}`;
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });

    // Format Telegram alert text (HTML mode prevents entity parsing bugs on underscores)
    const tgText = `🔔 <b>NEW APPOINTMENT BOOKED</b> 🔔\n\n` +
      `🔖 <b>Booking ID:</b> <code>${escapeHtml(bookingId)}</code>\n` +
      `🏢 <b>Branch:</b> ${escapeHtml(branch)}\n` +
      `💆‍♀️ <b>Service:</b> ${escapeHtml(serviceName)} (${escapeHtml(servicePrice)})\n` +
      `📅 <b>Date:</b> ${escapeHtml(date)}\n` +
      `⏰ <b>Time Slot:</b> ${escapeHtml(timeSlot)}\n` +
      `✂️ <b>Specialist:</b> ${escapeHtml(specialist)}\n\n` +
      `👤 <b>Customer:</b> ${escapeHtml(customerName)}\n` +
      `📞 <b>Phone:</b> <code>${escapeHtml(customerPhone)}</code>\n` +
      (customerTelegram ? `✈️ <b>Telegram:</b> @${escapeHtml(customerTelegram.replace('@', ''))}\n` : '') +
      (notes ? `📝 <b>Notes:</b> ${escapeHtml(notes)}\n` : '') +
      `💳 <b>Payment:</b> ${escapeHtml(paymentMethod)}\n` +
      `⏱ <b>Booked At:</b> ${escapeHtml(timestamp)}\n\n` +
      `👉 <i>Open Staff Admin to Confirm or Reschedule.</i>`;

    // Telegram Bot Configuration
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8407260653:AAF4Ys0ZLGro9oCAr_wZgXkMpwnG8JkrcE0';
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1004328071470';

    // Dispatch Telegram Alert
    try {
      await sendTelegramMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, tgText);
    } catch (tgErr) {
      console.error('Telegram dispatch error (non-fatal):', tgErr.message);
    }

    const bookingRecord = {
      id: bookingId,
      customerName,
      customerPhone,
      customerTelegram,
      serviceName,
      servicePrice,
      branch,
      date,
      timeSlot,
      specialist,
      notes,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      bookingId,
      message: 'Appointment successfully registered.',
      data: bookingRecord
    });

  } catch (error) {
    console.error('Booking API exception:', error);
    return res.status(500).json({ error: 'Internal server error processing booking.' });
  }
};

function sendTelegramMessage(token, chatId, text) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 6000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`Telegram API responded with HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Telegram request timed out'));
    });

    req.write(payload);
    req.end();
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
