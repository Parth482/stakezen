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

<img width="1920" height="1080" alt="2" src="https://github.com/user-attachments/assets/2d3c1f3b-6a85-46d3-bf5a-2032b43b9eae" />
<img width="1920" height="1080" alt="2" src="https://github.com/user-attachments/assets/47cffc1f-ffa4-4369-bd89-91728030be6d" />
<img width="1920" height="1080" alt="7" src="https://github.com/user-attachments/assets/7eb9e748-f621-4891-918f-91be5d0340f3" />
<img width="1920" height="1080" alt="9" src="https://github.com/user-attachments/assets/68e42dee-f041-477a-8faa-c8a7905bb832" />
<img width="1920" height="1080" alt="11" src="https://github.com/user-attachments/assets/72c3f929-e2d4-48d6-a20b-61f4d1e93902" />
<img width="1920" height="1080" alt="12" src="https://github.com/user-attachments/assets/27716ff3-d2a2-4152-9481-faf3a73a9bae" />
<img width="1920" height="1080" alt="13" src="https://github.com/user-attachments/assets/53b2e33b-fe08-4659-b3f7-1cbe96caecbb" />
<img width="1920" height="1080" alt="14" src="https://github.com/user-attachments/assets/8cd854fa-b7e4-4180-a023-80d97a074dd3" />
<img width="1920" height="1080" alt="16" src="https://github.com/user-attachments/assets/a1e7b35f-bee6-4da4-982d-b6df86286a43" />
<img width="1920" height="1080" alt="18" src="https://github.com/user-attachments/assets/d53e03ad-2d71-4457-a698-fada24c82ab7" />
<img width="1920" height="1080" alt="21" src="https://github.com/user-attachments/assets/feead297-8ac0-438f-8583-2e4ab0d84cfe" />
<img width="1920" height="1080" alt="22" src="https://github.com/user-attachments/assets/5527f99c-ca3d-446f-955f-b0012ab2b1c3" />
<img width="1920" height="1080" alt="23" src="https://github.com/user-attachments/assets/25d8cf65-90d9-41cf-9229-c34cca7ba3bb" />
<img width="1920" height="1080" alt="25" src="https://github.com/user-attachments/assets/bc28a846-a9f9-4d1e-889e-6ae0ff912b89" />
<img width="1920" height="1080" alt="26" src="https://github.com/user-attachments/assets/807bd1dd-37a3-4293-8d59-fc57e61cdc57" />
<img width="1920" height="1080" alt="29" src="https://github.com/user-attachments/assets/2679af84-42a1-4244-953a-1b0d7a254079" />
<img width="1920" height="1080" alt="30" src="https://github.com/user-attachments/assets/d5d3564e-d6d6-421f-8b78-976ffaa8d365" />
<img width="1920" height="1080" alt="31" src="https://github.com/user-attachments/assets/4ea5f07e-d723-429b-ae2b-1c5ad0b2c26c" />
<img width="1920" height="1080" alt="32" src="https://github.com/user-attachments/assets/5cb45c55-8ec0-42d4-b8bb-ad0a28c5179b" />
<img width="1920" height="1080" alt="33" src="https://github.com/user-attachments/assets/939d3ced-fceb-4dcd-a8f5-cce523edef73" />
<img width="1920" height="1080" alt="34" src="https://github.com/user-attachments/assets/add2919f-d8be-4173-a05b-b079dbf04b1d" />
<img width="1920" height="1080" alt="36" src="https://github.com/user-attachments/assets/b0cb5410-2df6-4f4c-91cc-528cce1fd03a" />
<img width="1920" height="1080" alt="37" src="https://github.com/user-attachments/assets/96a4ad7b-c858-4a07-b11a-000acd5346bb" />
<img width="1920" height="1080" alt="38" src="https://github.com/user-attachments/assets/2bc2c05f-4c29-419b-ae0e-8a9cf2d1dca7" />
<img width="1920" height="1080" alt="39" src="https://github.com/user-attachments/assets/05982d92-1aca-489f-ad70-74af26c0c627" />




---

## 👨‍💻 Author

**Parth Joshi**  
Full-Stack Developer  
[GitHub](https://github.com/Parth482)

---

## 🪙 License

This project is licensed under the MIT License — feel free to use and modify it.
