# Project Verification Checklist

Use this guide to verify that all features and data you entered are working correctly in the **Inventory Management System** (Kongu Hi-Tech Rice Industries).

---

## 1. Prerequisites & Setup

### 1.1 Environment
- [ ] **Node.js** installed (v14+).
- [ ] **MongoDB** running locally or **MONGODB_URI** set in backend `.env` (e.g. MongoDB Atlas).
- [ ] Backend `.env` has:
  - `MONGODB_URI` (required)
  - `JWT_SECRET` (optional; default used if not set)
  - `PORT` (optional; default 5000)

### 1.2 Install & Run
```bash
# Backend
cd backend
npm install
npm start
# Server should run on http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
npm start
# App should open at http://localhost:3000
```

### 1.3 Quick API health check
- [ ] Open **http://localhost:5000/api/health** in browser or Postman.  
  Expected: `{ "status": "OK", "message": "Kongu Rice Industries API is running" }`

---

## 2. Role Selection & Entry Points

- [ ] Go to **http://localhost:3000/**.
- [ ] You see **Role Selection** with options: **Admin**, **Dealer**, **User**.
- [ ] Each option navigates to the correct login/setup page:
  - Admin → `/admin/login`
  - Dealer → `/dealer/login` or `/dealer/setup`
  - User → `/user/login`

---

## 3. Admin Flow

### 3.1 Admin Auth
- [ ] **Sign up:** `/admin/signup` — create admin account (name, email, password).
- [ ] **Login:** `/admin/login` — login with email & password; redirect to `/admin/dashboard`.
- [ ] **Protected routes:** Without login, visiting `/admin/dashboard` redirects to `/admin/login`.

### 3.2 Admin UI (layout)
- [ ] **Sidebar:** Blue gradient, logo “K”, “Kongu” + “Hi-Tech Rice Industries”; menu: Dashboard, Paddy Inward, Godown, Rice Stock, Sales, Recent Orders, Dispatch, Payments, Settings.
- [ ] **Header:** “Kongu Hi-Tech Rice Industries” on left; **username + role + logout** on right.
- [ ] **Logout** clears session and redirects to home.

### 3.3 Admin – Dashboard
- [ ] **KPI cards** load: Paddy Stock, Rice Stock, Rice Bags Stock, Dealer Orders (with values or 0).
- [ ] Bag stock by size (5kg, 10kg, 25kg, 75kg) if data exists.
- [ ] Dealers section with total/active and “Manage Dealers” link.
- [ ] Alerts (if any), charts (Overview Reports with Daily/Weekly/Monthly), Payment Status pie chart.
- [ ] Paddy Stock Details table, Recent Sales table.

**APIs used:**  
`/api/reports/dashboard`, `/api/reports/charts?period=...`, `/api/admin/alerts`, `/api/paddy/stock`, `/api/sales/recent`, `/api/dealers`, `/api/sales`, `/api/dealer-orders`

### 3.4 Admin – Paddy Inward
- [ ] Godown dropdown loads.
- [ ] Submit paddy inward form; success toast; list/table updates.

**API:** `GET/POST /api/paddy/*`, `GET /api/godown`

### 3.5 Admin – Godown
- [ ] List godowns; add new godown; data persists.

**API:** `GET/POST /api/godown`

### 3.6 Admin – Rice Stock
- [ ] Rice list loads; add new rice (type, name, quantity, bags, godown); data persists.

**API:** `GET/POST /api/rice`, `GET /api/godown`

### 3.7 Admin – Sales
- [ ] Sales list; create sale (customer, rice, quantity, etc.); data appears in list.

**API:** `GET/POST /api/sales`, `/api/dealers`, `/api/dealer-orders`

### 3.8 Admin – Recent Orders
- [ ] Dealer orders and/or user orders load; approve/update status for dealer orders; update status/payment for user orders.

**APIs:** `GET /api/dealer-orders`, `GET /api/user/admin/orders`, `PUT /api/user/admin/orders/:id/status`, etc.

### 3.9 Admin – Dispatch
- [ ] Sales list; update dispatch status; changes persist.

**API:** `GET /api/sales`, `PUT /api/sales/:id`

### 3.10 Admin – Payments
- [ ] Summary cards (Total Receivable, Received, Pending) and chart load.
- [ ] Customer Ledger table loads (no crash); “Record Payment” works for sales.
- [ ] Dealer Invoice Payments section: select invoice, enter amount, record payment.

**APIs:** `GET /api/payments/summary`, `GET /api/payments/ledger`, `POST /api/payments`, `GET /api/sales`, `GET /api/invoices`

### 3.11 Admin – Settings
- [ ] Update profile (name, email); success toast.
- [ ] System Information and Industry Profile sections display correctly.

**API:** `PUT /api/admin/profile`

---

## 4. Dealer Flow

### 4.1 Dealer Auth & Setup
- [ ] **Login:** `/dealer/login` or setup → login with credentials.
- [ ] After login, redirect to **Dealer Dashboard**.

### 4.2 Dealer – Dashboard / Orders / Invoices
- [ ] Dashboard shows dealer-specific summary.
- [ ] **Orders:** list dealer orders; place or view orders.
- [ ] **Invoices:** list dealer invoices.

**APIs:** Dealer auth routes, `GET /api/dealer-orders/dealer`, `GET /api/invoices/dealer`, etc.

---

## 5. User (Customer) Flow – Main Verification

### 5.1 User Auth
- [ ] **Sign up:** `/user/signup` — name, email, phone, address, password (min 6); success and redirect to dashboard.
- [ ] **Login:** `/user/login` — email & password; redirect to `/user/dashboard`.
- [ ] **Token:** After login, `localStorage` has `userToken`; requests send `Authorization: Bearer <token>`.

**APIs:**  
- `POST /api/user-auth/register`  
- `POST /api/user-auth/login`  
- `GET /api/user-auth/me` (with token)

### 5.2 User – Dashboard (Admin-style UI)
- [ ] **Sidebar:** Same blue gradient; menu: Dashboard, Products, My Orders, Profile; Logout at bottom.
- [ ] **Header:** “Kongu Hi-Tech Rice Industries” + “Customer Portal”; **username + “Customer” + logout** on right.
- [ ] **KPI cards:** Total Orders, Pending Orders, Completed Orders, Total Spent (values from your orders).
- [ ] **Order Statistics** card with period tabs.
- [ ] **Recent Orders** table (Admin-style); “View All” goes to My Orders.

**API:** `GET /api/user/orders` (with `Authorization: Bearer <userToken>`)

### 5.3 User – Products
- [ ] **Products list** loads (from rice stock).
- [ ] **Filters:** search, category, sort, grid/list view work.
- [ ] **Product cards** show name/type, price per kg, stock, bag sizes; **Add to Cart** (select bag size + quantity) adds item.
- [ ] **Cart summary** (when cart not empty): item count, total amount, **Checkout** button.

**API:** `GET /api/user/products` (no auth required)

**Note:** Backend returns `riceType`, `riceName`, `ratePerKg`, `availableQuantity`, `bagsStock`. If product “name” or “category” appears empty, the frontend may need to use `product.riceName` or `product.riceType` for display.

### 5.4 User – Cart & Checkout
- [ ] From Products, add items → go to **Checkout** (`/user/checkout`).
- [ ] **Order summary** shows items (name, bag size, quantity, amount).
- [ ] **Shipping:** address, phone; **Payment method** (e.g. cash on delivery); notes.
- [ ] **Place Order** sends request; success toast; redirect to My Orders; cart cleared.

**API:** `POST /api/user/order` (with auth)

**Backend expects each item as:**  
`riceType`, `brand`, `bagSize`, `quantityBags`, and will compute `totalQuantityKg`, `ratePerKg`, `totalAmount`.  
If “Place Order” fails with validation errors, check that the frontend sends items in this shape (e.g. `riceType`, `brand`, `quantityBags`). Cart currently stores `name`, `quantity`, `totalPrice` — checkout may need to map these to the API format.

### 5.5 User – My Orders
- [ ] **Orders table** loads (Admin-style table).
- [ ] Columns: Order ID, Date, Items, Amount, Status, Actions.
- [ ] **View Details** opens modal with status, payment, items, total, delivery info.
- [ ] **Cancel** works for pending orders.

**APIs:** `GET /api/user/orders`, `PUT /api/user/orders/:id/cancel`

### 5.6 User – Profile
- [ ] **Profile Settings** page: view name, email, phone, address.
- [ ] **Edit Profile:** change name, phone, address; **Save**; success toast; data updates (email read-only).
- [ ] **Account Information** card: role “Customer”, Member since.
- [ ] **Quick Actions:** View Orders, Browse Products, Dashboard.
- [ ] **Security Settings** section present.

**API:** `PUT /api/user-auth/profile` (with auth)

---

## 6. API Quick Reference (Backend)

| Purpose              | Method | Endpoint                          | Auth / notes        |
|----------------------|--------|-----------------------------------|---------------------|
| Health               | GET    | `/api/health`                     | No                  |
| Admin login          | POST   | `/api/auth/login`                 | -                   |
| User register        | POST   | `/api/user-auth/register`         | -                   |
| User login           | POST   | `/api/user-auth/login`            | -                   |
| User profile         | GET    | `/api/user-auth/me`               | Bearer (userToken)  |
| Update user profile  | PUT    | `/api/user-auth/profile`         | Bearer (userToken)  |
| User products        | GET    | `/api/user/products`              | No                  |
| User place order     | POST   | `/api/user/order`                 | Bearer (userToken)  |
| User orders          | GET    | `/api/user/orders`                | Bearer (userToken)  |
| Cancel user order    | PUT    | `/api/user/orders/:id/cancel`     | Bearer (userToken)  |
| Reports dashboard    | GET    | `/api/reports/dashboard`          | Admin               |
| Payments summary     | GET    | `/api/payments/summary`           | Admin               |
| Payments ledger      | GET    | `/api/payments/ledger`            | Admin               |

---

## 7. Data You Entered – Where It Appears

- **Admin profile (name, email):** Header (name), Settings page, API `/api/admin/profile`.
- **User profile (name, email, phone, address):** User Profile page, checkout prefill (address, phone), API `/api/user-auth/profile`.
- **Paddy / Godown / Rice:** Admin → Paddy Inward, Godown, Rice Stock; feeds reports and user products.
- **Sales / Dealers / Invoices:** Admin → Sales, Dealers, Recent Orders, Payments; Dealer → Orders, Invoices.
- **User orders:** User Dashboard (KPIs + Recent Orders), My Orders, Admin Recent Orders (if admin view exists).

---

## 8. Common Issues & Fixes

| Issue | What to check |
|-------|----------------|
| **Blank dashboard / no data** | Backend running on port 5000; MongoDB connected; no CORS/network errors in browser DevTools (F12 → Network). |
| **401 / “Invalid credentials”** | Correct role (user vs admin vs dealer); token in `localStorage` (e.g. `userToken` for user); logout and login again. |
| **Payments page crash** | Ledger entries with missing `status` are now handled; ensure backend returns `status` for ledger rows if you add new logic. |
| **User products empty** | Rice records in DB with `status: 'ready'` or `'in_production'` and `quantity > 0`; `GET /api/user/products` returns array. |
| **Place order fails (validation)** | Request body must have `items[]` with `riceType`, `brand`, `bagSize`, `quantityBags`; `shippingAddress`, `contactPhone`, `paymentMethod`. Map cart items to this shape in checkout if needed. |
| **CORS errors** | Backend `cors()` is enabled; frontend calls use same origin or correct API base URL (e.g. `http://localhost:5000`). |

---

## 9. Checklist Summary

- [ ] Backend and frontend start without errors.
- [ ] Health check returns OK.
- [ ] Role selection and all three roles (Admin, Dealer, User) are reachable.
- [ ] Admin: login, dashboard, at least one of Paddy/Godown/Rice/Sales/Payments/Settings works.
- [ ] User: signup, login, dashboard, products list, profile update work.
- [ ] User: add to cart, checkout, place order, see order in My Orders (if API payload matches).
- [ ] Payments page loads without runtime error.
- [ ] Logout works for Admin and User.

Use this checklist to confirm that everything you configured and the features you care about are working end-to-end. If a step fails, use the **API Quick Reference** and **Common Issues** sections to debug.
