const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');
const Application = require('../models/Application.cjs');
const Internship = require('../models/Internship.cjs');

const router = express.Router();

// Middleware to verify admin token
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = user;
    next();
  });
};

// Get admin dashboard data
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Get user counts
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const employers = await User.countDocuments({ role: 'employer' });
    
    // Get internship and application counts
    const internships = await Internship.countDocuments();
    const applications = await Application.countDocuments();

    // Get recent users (last 10)
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    // Create recent activity from recent users
    const recentActivity = recentUsers.map(user => ({
      id: user._id,
      title: 'New User Registration',
      description: `${user.name} joined as ${user.role}`,
      time: user.createdAt,
      type: 'user_registration'
    }));

    res.json({
      stats: {
        totalUsers,
        students,
        employers,
        internships,
        applications
      },
      recentUsers,
      recentActivity
    });

  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;