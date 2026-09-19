// Vercel Serverless Function: /api/admin/login
// Simple secure passcode authentication for Front Desk Receptionist / Owner

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { passcode } = req.body || {};
    const VALID_PASSCODE = process.env.ADMIN_PASSCODE || 'aura2026';

    if (!passcode) {
      return res.status(400).json({ error: 'Passcode is required.' });
    }

    if (passcode.trim() === VALID_PASSCODE) {
      // Return session token and user info
      const token = 'aura_staff_session_' + Date.now().toString(36);
      return res.status(200).json({
        success: true,
        token,
        user: {
          role: 'Front Desk Receptionist',
          branch: 'Battambang Main Studio',
          name: 'Staff Desk'
        }
      });
    } else {
      return res.status(401).json({ error: 'Invalid passcode. Default demo is: aura2026' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Authentication failed.' });
  }
};
