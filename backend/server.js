const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dealer-auth', require('./routes/dealerAuth'));
app.use('/api/paddy', require('./routes/paddy'));
app.use('/api/rice', require('./routes/rice'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/godown', require('./routes/godown'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/dealers', require('./routes/dealers'));
app.use('/api/dealer-orders', require('./routes/dealerOrders'));
app.use('/api/invoices', require('./routes/invoices'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Kongu Rice Industries API is running' });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kongu_rice_industries';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  console.log(`📊 Database: ${mongoose.connection.name}`);
  console.log(`🌐 Host: ${mongoose.connection.host || 'Atlas Cluster'}`);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('💡 Please check your MONGODB_URI in .env file');
  process.exit(1);
});

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
