# 🪙 StakeZen — Mini Betting System with Digital Wallet & PayPal Integration

StakeZen is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application that allows users to deposit funds, place bets, and withdraw winnings. It features **role-based authentication**, **wallet management**, and **PayPal Sandbox payment integration**.

---

## 🎯 Objective

StakeZen demonstrates:
- Role-based authentication (Admin & User)
- Secure wallet and balance management
- Payment gateway integration using **PayPal Sandbox**
- RESTful API architecture
- Clean frontend with React Hooks and Axios
- Proper data modeling using MongoDB + Mongoose

---

## 🧱 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React.js (Hooks, Axios, Routing) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT (JSON Web Tokens) |
| **Payment Gateway** | PayPal Sandbox |
| **State Management** | Local State via React Hooks |
| **Styling** | CSS, Responsive Design |

---

## 🗂️ Folder Structure

### 🖥 Client (React)
```
client/
│
├── public/
├── src/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   └── AdminDashboard.css
│   │
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── EventCard.jsx
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminProtectedRoute.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── RegisterPage.jsx
│   │
│   ├── utils/
│   │   └── avatarColor.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   └── index.css
│
└── package.json
```

### ⚙️ Server (Node.js + Express)
```
server/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── adminController.js
│   │   ├── walletController.js
│   │   └── betController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Wallet.js
│   │   ├── Bet.js
│   │   ├── BetEvent.js
│   │   └── Transaction.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── betRoutes.js
│   │   └── walletRoutes.js
│   │
│   └── utils/
│       └── generateToken.js
│
├── app.js
├── server.js
└── seedAdmin.js
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/stakezen.git
cd stakezen
```

### 2️⃣ Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3️⃣ Environment Variables

Create `.env` file inside `server/` and add:

```
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_secret
CLIENT_URL=http://localhost:3000
PAYPAL_ACCESS_TOKEN=your_paypal_access_token

```

---

## 🧾 API Endpoints

Admin-related

Admin login: POST /api/admin/login → returns JWT + admin info.

Dashboard stats: GET /api/admin/stats → total users, bets, deposits, withdrawals, wallet balance, pending withdrawals.

Users list: GET /api/admin/users → users with wallet info.

Transactions: GET /api/admin/transactions → all transactions system-wide.

Pending withdrawals: GET /api/admin/withdraw/pending

Update withdrawal: PATCH /api/admin/withdraw/:transactionId → approve/decline.

Bets breakdown: GET /api/admin/bets/breakdown → won/lost/pending counts + totals.

All bets: GET /api/bets/all

Resolve/cancel bet events: PATCH /api/bets/events/resolve/:eventId, PATCH /api/bets/events/cancel/:eventId

Create bet event: POST /api/bets/events

Open bet events for users: GET /api/bets/events

User-related

Register: POST /api/auth/register

Login: POST /api/auth/login

Profile: GET /api/user/profile, PATCH /api/user/profile

Wallet: GET /api/user/wallet

Transactions: GET /api/user/transactions

Withdraw: POST /api/user/withdraw

Bets: GET /api/bets (user bets), POST /api/bets (place bet)

Wallet & PayPal

Simulated deposit: POST /api/wallet/deposit → updates wallet & creates transaction.

Withdrawal request: POST /api/wallet/withdraw

Wallet balance: GET /api/wallet

Models in play

User → contains role (user/admin), wallet ref.

Wallet → balance, currency.

Transaction → types: deposit, withdraw_request, bet, bet_winnings, bet_refund.

BetEvent → created by admin, options/odds, status (open/resolved/closed)

Bet → user's bet on a BetEvent, with stake, selection, odds, potential payout, status (pending/won/lost/cancelled).
---

## 💳 Payment Gateway (PayPal Sandbox)

- Integrated with **PayPal Sandbox** for safe testing.  
- Users can simulate deposits using test credentials.  
- Transactions are logged in the database (`transactions` collection).  
- Withdrawals are simulated — Admin approval adjusts wallet balance.

---

## 🧠 State Management (Frontend)

StakeZen uses **React Hooks** (`useState`, `useEffect`) for local state management.  
Each component handles:
- Its own API calls (via Axios)
- State updates (wallet, events, bets)
- Token storage in `localStorage`

---

## 🔒 Authentication & Authorization

- JWT-based authentication.
- Middleware verifies tokens for protected routes.
- Role-based access control:
  - **Admin:** Can view/manage users, transactions, and withdrawals.
  - **User:** Can bet, deposit, and request withdrawals.


---

## 🧠 Future Enhancements
- Integrate multiple payment gateways (Stripe, Razorpay)
- Real-time betting odds
- Enhanced UI animations and analytics

---

## 🧰 Scripts

**Run Backend:**
```bash
cd server
npm run dev
```

**Run Frontend:**
```bash
cd client
npm start
```

---

## 📸 Demo

Add screenshots or a short demo video here after recording your walkthrough.

---

## 👨‍💻 Author

**Parth Joshi**  
Full-Stack Developer  
[GitHub](https://github.com/Parth482)

---

## 🪙 License

This project is licensed under the MIT License — feel free to use and modify it.
