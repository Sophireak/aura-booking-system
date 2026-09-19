# Aura Booking & Appointment System (with Staff Admin Portal)

> **Live Portfolio Project 02** for Sophireak (`@bNha_dev`)  
> Full-Stack Mobile-First Booking Engine & Front Desk Management Portal tailored for Cambodian small businesses (beauty salons, spas, hair studios, clinics).

---

## 🇰🇭 Why This Design Solves Cambodian UX Realities

1. **Zero Registration Barrier (Guest Booking)**:
   - 90%+ of Cambodian clients drop off if forced to create an account with email and password just to book an appointment.
   - Aura features a seamless 3-step guest booking workflow: **Service & Stylist** → **Date & Time Slot** → **Name & Phone**.
2. **Cambodian Mobile Phone Input**:
   - Built-in validation and formatting for Smart, Cellcard, and Metfone numbers (`012...`, `070...`, `098...`).
3. **Bilingual Context (English + Khmer)**:
   - Clean international aesthetic paired with natural Khmer guidance labels (`កក់ម៉ោងងាយស្រួល`, `មិនចាំបាច់បង្កើតគណនី`, `ទូទាត់ប្រាក់នៅហាង`).
4. **Instant Telegram Dispatch & Direct Receipt**:
   - Whenever an appointment is booked, a serverless webhook silently alerts the clinic/salon staff Telegram supergroup in under 1 second.
   - Customers receive an instant booking reference code (`AUR-xxxx`) with a one-click button to message the front desk on Telegram.
5. **No Forced Upfront Payment**:
   - Clear "Pay at Counter (Cash or KHQR Bakong)" guarantee. Eliminates customer hesitation about online deposits.
6. **Mobile Front Desk Admin Portal (`/admin`)**:
   - Protected PIN authentication (`aura2026`).
   - One-tap customer contact actions: **Direct Call** (`tel:`) and **Direct Telegram** (`t.me/`).
   - Status lifecycle: `Pending` → `Confirmed` → `Completed` → `Cancelled`.
   - Walk-in booking modal for receptionists to manually schedule in-person clients.

---

## 🛠 Tech Stack & Architecture

- **Frontend**: HTML5, Modern CSS, Bootstrap 5.3, Plus Jakarta Sans & Kantumruy Pro fonts.
- **Backend**: Node.js Serverless Edge Functions (Vercel):
  - `/api/book`: Validates booking, generates reference code, dispatches Telegram alert.
  - `/api/admin/login`: Front desk PIN verification.
  - `/api/admin/appointments`: Appointment management & walk-in entry.
- **Notification API**: Telegram Bot API (`https://api.telegram.org`).
- **Hosting Cost**: **$0.00 / month** on Vercel Free Tier.

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/Sophireak/aura-booking-system.git
cd aura-booking-system

# Start a local static or dev server
npx serve .
# Or run with Vercel CLI
npx vercel dev
```

Open `http://localhost:3000` in your mobile browser or device simulator:
- **Client Booking**: `http://localhost:3000/index.html`
- **Staff Admin Portal**: `http://localhost:3000/admin.html` (Passcode: `aura2026`)

---

## 📱 Developer Profile

- **Developer**: Sophireak (Independent Full-Stack Web Developer)
- **Location**: Battambang, Cambodia (Serving clients nationwide & remotely)
- **Telegram**: [@bNha_dev](https://t.me/bNha_dev)
- **Portfolio**: [https://sophireak.github.io/](https://sophireak.github.io/)
