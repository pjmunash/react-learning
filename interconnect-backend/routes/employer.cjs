const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');
const Application = require('../models/Application.cjs');
const Internship = require('../models/Internship.cjs');

const router = express.Router();

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get employer dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const employerId = req.user.userId;

    // Get employer's internships
    const internships = await Internship.find({ employerId });
    
    // Get applications for employer's internships
    const internshipIds = internships.map(i => i._id);
    const applications = await Application.find({ internshipId: { $in: internshipIds } })
      .populate('studentId', 'name email')
      .populate('internshipId', 'title company')
      .sort({ appliedAt: -1 });

    // Calculate stats
    const totalInternships = internships.length;
    const activeInternships = internships.filter(i => i.isActive).length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(app => app.status === 'pending').length;

    // Recent activity
    const recentActivity = applications.slice(0, 10).map(app => ({
      id: app._id,
      title: 'New Application',
      student: app.studentId?.name || 'Unknown Student',
      role: app.internshipId?.title || 'Unknown Role',
      status: app.status,
      time: app.appliedAt,
      type: 'application_received'
    }));

    res.json({
      stats: {
        internships: totalInternships,
        activeInternships,
        applications: totalApplications,
        pendingApplications
      },
      recentActivity,
      internships
    });

  } catch (error) {
    console.error('Error fetching employer dashboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new internship
router.post('/internships', authenticateToken, async (req, res) => {
  try {
    const employerId = req.user.userId;
    const { title, company, description, requirements, location, duration, stipend } = req.body;

    const internship = new Internship({
      title,
      company,
      employerId,
      description,
      requirements: requirements.split(',').map(r => r.trim()),
      location,
      duration,
      stipend: stipend || 0
    });

    await internship.save();
    res.status(201).json({ message: 'Internship created successfully', internship });
  } catch (error) {
    console.error('Error creating internship:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;