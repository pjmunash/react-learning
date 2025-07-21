const express = require('express');
const router = express.Router();
const User = require('../models/User.cjs');
const Internship = require('../models/Internship.cjs');
const Application = require('../models/Application.cjs');
const auth = require('../middleware/auth.cjs');

// Admin dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Get statistics
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const totalInternships = await Internship.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });

    // Get recent users (last 10)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role createdAt');

    // Get recent internships (last 10)
    const recentInternships = await Internship.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title company location createdAt');

    res.json({
      stats: {
        totalUsers,
        totalStudents,
        totalEmployers,
        totalInternships,
        totalApplications,
        pendingApplications
      },
      recentUsers,
      recentInternships
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;