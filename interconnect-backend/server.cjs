require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.cjs');
const authRoutes = require('./routes/auth.cjs');
const studentRoutes = require('./routes/student.cjs');
const employerRoutes = require('./routes/employer.cjs');
const adminRoutes = require('./routes/admin.cjs');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://pjmunash.github.io',  // Your GitHub Pages domain
      'https://react-learning-q8t3.onrender.com'  // Your backend domain (for testing)
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'InterConnect Backend API is running with MongoDB!',
    database: 'MongoDB Atlas',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', require('./routes/student.cjs'));
app.use('/api/employer', employerRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;  // Make sure this is 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for localhost:5173-5180`);
  console.log(`📊 Database: MongoDB Atlas`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
});


