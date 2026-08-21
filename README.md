# ShopKart — Real-Time E-Commerce & Edge Inventory Monorepo

Production-grade, Flipkart-style e-commerce platform featuring atomic edge transactions with Turso libSQL, real-time WebSocket inventory synchronization, React Admin Seller Hub, and modern Jetpack Compose Android customer app.

---

## 🏗️ Architecture & Monorepo Structure

```
/shopkart
  ├── /database       → SQLite/libSQL schema.sql & seed.sql (Turso edge database)
  ├── /server         → Node.js + Express API + Socket.io + libSQL client
  ├── /admin-panel    → React + Vite + Tailwind CSS Seller Hub (GitHub Pages deployable)
  ├── /app            → Kotlin + Jetpack Compose Android Customer App
  └── README.md       → Comprehensive architecture & deployment manual
```

---

## ⚡ 1. Database Setup (Turso Edge Database)

### Prerequisites:
Install the Turso CLI:
```bash
# MacOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (Powershell)
irm https://get.tur.so/install.ps1 | iex
```

### Steps:
1. **Login & Create Database**:
   ```bash
   turso auth login
   turso db create shopkart-db
   ```

2. **Retrieve Connection URL and Auth Token**:
   ```bash
   turso db show shopkart-db --url
   # Example: libsql://shopkart-db-[username].turso.io

   turso db tokens create shopkart-db
   # Save the returned JWT token
   ```

3. **Apply Schema and Seed Data**:
   ```bash
   turso db shell shopkart-db < database/schema.sql
   turso db shell shopkart-db < database/seed.sql
   ```

---

## 🚀 2. Backend Server Setup (Node.js + Express + Socket.io)

### Local Run:
1. Navigate to the server folder:
   ```bash
   cd server
   npm install
   ```

2. Configure `.env`:
   ```env
   PORT=5000
   TURSO_DATABASE_URL=libsql://shopkart-db-[username].turso.io
   TURSO_AUTH_TOKEN=your_turso_jwt_auth_token_here
   JWT_SECRET=super_secure_jwt_secret_key_shopkart_prod_2026
   ```

3. Start server:
   ```bash
   npm run dev
   # Server listens on http://localhost:5000
   ```

### Production Deployment:
Deploy to **Render**, **Railway**, or **Fly.io**:
- Set Environment Variables: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `JWT_SECRET`, `NODE_ENV=production`.
- Start Command: `npm start`

---

## 📊 3. Admin Panel Setup & GitHub Pages Deployment (React + Vite)

1. Navigate to the admin panel directory:
   ```bash
   cd admin-panel
   npm install
   ```

2. Run locally in development mode:
   ```bash
   npm run dev
   # Accessible at http://localhost:3000
   ```

3. **Deploy to GitHub Pages**:
   - In `vite.config.js`, set `base: '/shopkart-admin/'` (matching your repository name).
   - In `.env.production`, set `VITE_API_URL=https://your-deployed-server.onrender.com`.
   - Run the deploy script:
     ```bash
     npm run deploy
     ```

### Default Credentials:
- **Admin**: `admin@shopkart.com` / `admin123`
- **Customers**: `customer1@shopkart.com` / `customer123`

---

## 📱 4. Android App (Jetpack Compose Customer App)

The Android customer application (`/app`) is written in Kotlin with Material 3:
- **Real-Time Stock Updates**: Watches SKU stock changes via WebSockets and updates live inventory badges.
- **Atomic Checkout & Cart**: Calculates discounts with coupon codes (`FESTIVE20`), supports express delivery dispatch, and provides live fulfillment tracking.
- **Theme**: Styled with the **Professional Polish** design system.

### Build & Run:
1. Open the repository root in Android Studio or compile via the Gradle build system:
   ```bash
   gradle assembleDebug
   ```
2. The generated debug APK is located in:
   `app/build/outputs/apk/debug/app-debug.apk`

---

## 🔒 Security & Concurrency Highlights

- **Atomic Transactions**: Turso `batch('write')` guarantees check-then-decrement isolation so stock cannot be oversold under high concurrency.
- **Audit Logs**: Every inventory modification creates an immutable entry in `inventory_logs` recording actor ID, warehouse code, and reason.
- **WebSocket Broadcast**: Emits `inventory:update` to all clients viewing the product and `inventory:low-stock` to the admin seller hub immediately when a threshold is breached.
