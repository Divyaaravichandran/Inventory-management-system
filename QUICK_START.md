# Quick Start Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example or create new)
# Add your MongoDB connection string and JWT secret

# Start MongoDB (if running locally)
# On Windows: Make sure MongoDB service is running
# On Mac/Linux: mongod

# Start backend server
npm run dev
# Server will run on http://localhost:5000
```

### 2. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm start
# Frontend will run on http://localhost:3000
```

### 3. First Time Setup

1. Open browser to `http://localhost:3000`
2. You'll see the Role Selection screen
3. Click on "Admin" card
4. Click "Sign up" to create your first admin account
5. Fill in the registration form
6. You'll be automatically logged in and redirected to the dashboard

### 4. Testing the System

1. **Add a Godown**: Go to Godown Management → Add Godown
2. **Add Paddy**: Go to Paddy Inward → Fill the form → Add Paddy Inward
3. **Add Rice Stock**: Go to Rice Stock → Add Rice Stock
4. **Record a Sale**: Go to Sales → Fill customer and rice details → Record Sale
5. **Track Dispatch**: Go to Dispatch → Update status as needed
6. **Record Payment**: Go to Payments → Click "Record Payment" → Fill form

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your MongoDB connection string in `.env`
- Default: `mongodb://localhost:27017/kongu_rice_industries`

### Port Already in Use
- Backend: Change PORT in `.env` file
- Frontend: Change port in `package.json` scripts or use `PORT=3001 npm start`

### CORS Errors
- Make sure backend is running on port 5000
- Check that frontend API calls use correct URL (http://localhost:5000)

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in backend `.env`
- Make sure you're logged in as admin

## Default Configuration

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- MongoDB: `mongodb://localhost:27017/kongu_rice_industries`

## Next Steps

- Add images to `frontend/src/assets/` folder
- Customize colors in `frontend/tailwind.config.js`
- Add more features as needed
