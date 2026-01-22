# Kongu Hi-Tech Rice Industries - Inventory & Operations Management System

A comprehensive MERN stack application for managing rice industry operations including procurement, production, sales, and finance.

## Features

- **Role-Based Access**: Admin-only access (Dealer and User roles disabled for future implementation)
- **Dashboard**: Real-time KPIs, charts, and reports
- **Procurement**: Paddy inward management with quality tracking
- **Production**: Rice stock management with bag tracking
- **Sales**: Order entry and dispatch tracking
- **Finance**: Payment management and customer ledger
- **Godown Management**: Storage capacity tracking and alerts
- **Alerts & Notifications**: Low stock warnings, payment alerts, capacity alerts

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Recharts, React Router
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT-based authentication

## Project Structure

```
CP_3/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context (Auth)
│   │   └── assets/      # Images and assets
│   └── public/
└── README.md
```

## Installation & Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kongu_rice_industries
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start MongoDB (make sure MongoDB is running on your system)

5. Start the backend server:
```bash
npm run dev
# or
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Usage

1. **Role Selection**: Start at the welcome screen and select "Admin" role
2. **Sign Up/Login**: Create an admin account or login with existing credentials
3. **Dashboard**: View KPIs, charts, and recent activity
4. **Paddy Inward**: Add new paddy procurement entries
5. **Godown Management**: Manage storage facilities
6. **Rice Stock**: Track rice inventory and bag stocks
7. **Sales**: Record new sales and track orders
8. **Dispatch**: Track vehicle dispatch and delivery status
9. **Payments**: Manage customer payments and view ledger
10. **Settings**: Update admin profile

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Paddy
- `GET /api/paddy` - Get all paddy records
- `POST /api/paddy` - Add paddy inward
- `GET /api/paddy/stock` - Get stock summary

### Rice
- `GET /api/rice` - Get all rice stock
- `POST /api/rice` - Add rice stock
- `GET /api/rice/stock` - Get stock summary

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale
- `PUT /api/sales/:id` - Update sale status
- `GET /api/sales/recent` - Get recent sales

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Record payment
- `GET /api/payments/summary` - Get payment summary
- `GET /api/payments/ledger` - Get customer ledger

### Godown
- `GET /api/godown` - Get all godowns
- `POST /api/godown` - Create godown
- `PUT /api/godown/:id` - Update godown

### Reports
- `GET /api/reports/dashboard` - Get dashboard data
- `GET /api/reports/charts` - Get chart data

### Admin
- `GET /api/admin/profile` - Get admin profile
- `PUT /api/admin/profile` - Update profile
- `GET /api/admin/alerts` - Get alerts

## Notes

- Only Admin role is functional. Dealer and User roles are disabled for future implementation.
- Images can be added to `frontend/src/assets/` folder
- Make sure MongoDB is running before starting the backend
- Update `.env` file with your MongoDB connection string and JWT secret

## License

This project is proprietary software for Kongu Hi-Tech Rice Industries.
