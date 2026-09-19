// Vercel Serverless Function: /api/admin/appointments
// Manage appointments: list, update status, add walk-ins

// Seed appointments for immediate interactive demo
const defaultAppointments = [
  {
    id: 'AUR-8412',
    customerName: 'Sokha Mean',
    customerPhone: '012 884 921',
    customerTelegram: 'sokha_m',
    serviceName: 'Hydra-Glow Facial Therapy',
    servicePrice: '$28 (~115,000៛)',
    branch: 'Battambang Main Studio',
    date: '2026-09-20',
    timeSlot: '10:00 AM - 11:00 AM',
    specialist: 'Bopha (Senior Esthetician)',
    notes: 'Sensitive skin, prefer organic serums',
    paymentMethod: 'Pay at Counter (Cash / KHQR)',
    status: 'confirmed',
    createdAt: '2026-09-19T14:30:00.000Z'
  },
  {
    id: 'AUR-7290',
    customerName: 'Channary Piseth',
    customerPhone: '098 451 209',
    customerTelegram: 'channary_p',
    serviceName: 'Signature Hair Cut & Gloss Treatment',
    servicePrice: '$18 (~74,000៛)',
    branch: 'Battambang Main Studio',
    date: '2026-09-20',
    timeSlot: '01:30 PM - 02:30 PM',
    specialist: 'Dara (Hair Director)',
    notes: 'First time visitor',
    paymentMethod: 'Pay at Counter (Cash / KHQR)',
    status: 'pending',
    createdAt: '2026-09-19T16:15:00.000Z'
  },
  {
    id: 'AUR-6104',
    customerName: 'Kosal Heng',
    customerPhone: '070 339 811',
    customerTelegram: '',
    serviceName: 'Aromatherapy Herbal Body Massage',
    servicePrice: '$35 (~144,000៛)',
    branch: 'Battambang Main Studio',
    date: '2026-09-20',
    timeSlot: '04:00 PM - 05:30 PM',
    specialist: 'Srey Mao (Massage Specialist)',
    notes: 'Shoulder tension relief',
    paymentMethod: 'Pay at Counter (Cash / KHQR)',
    status: 'confirmed',
    createdAt: '2026-09-19T18:00:00.000Z'
  },
  {
    id: 'AUR-5519',
    customerName: 'Vanna Roth',
    customerPhone: '017 992 400',
    customerTelegram: 'vanna_roth',
    serviceName: 'Luxury Gel Nail Art & Spa Pedicure',
    servicePrice: '$22 (~90,000៛)',
    branch: 'Battambang Main Studio',
    date: '2026-09-21',
    timeSlot: '11:00 AM - 12:30 PM',
    specialist: 'Lin (Nail Artist)',
    notes: 'French tip with chrome accent',
    paymentMethod: 'Pay at Counter (Cash / KHQR)',
    status: 'pending',
    createdAt: '2026-09-19T19:40:00.000Z'
  }
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple token header check (optional for demo, enforced if provided)
  const authHeader = req.headers.authorization || '';
  if (authHeader && !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  if (req.method === 'GET') {
    // Return appointments list
    return res.status(200).json({
      success: true,
      data: defaultAppointments
    });
  }

  if (req.method === 'PATCH') {
    // Update appointment status
    const { id, status } = req.body || {};
    if (!id || !status) {
      return res.status(400).json({ error: 'Missing appointment ID or status.' });
    }

    return res.status(200).json({
      success: true,
      message: `Appointment ${id} updated to ${status}.`,
      data: { id, status, updatedAt: new Date().toISOString() }
    });
  }

  if (req.method === 'POST') {
    // Create new walk-in appointment
    const appointment = req.body || {};
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newRecord = {
      ...appointment,
      id: `AUR-${randomCode}`,
      status: appointment.status || 'confirmed',
      createdAt: new Date().toISOString()
    };

    return res.status(201).json({
      success: true,
      message: 'Walk-in appointment recorded.',
      data: newRecord
    });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
};
