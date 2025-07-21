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

// Get student dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.userId;

    // Get applications with populated internship data
    const applications = await Application.find({ studentId })
      .populate('internshipId', 'title company location')
      .sort({ appliedAt: -1 });

    // Calculate stats
    const totalApplications = applications.length;
    const interviews = applications.filter(app => app.status === 'interview').length;
    const offers = applications.filter(app => app.status === 'accepted').length;

    // Get recent activity (last 10 applications)
    const recentActivity = applications.slice(0, 10).map(app => ({
      id: app._id,
      title: `Application ${app.status}`,
      company: app.internshipId?.company || 'Unknown Company',
      role: app.internshipId?.title || 'Unknown Role',
      status: app.status,
      time: app.appliedAt,
      type: 'application'
    }));

    // Mock profile views for now
    const profileViews = Math.floor(Math.random() * 50) + 10;

    res.json({
      stats: {
        applications: totalApplications,
        interviews,
        offers,
        profileViews
      },
      recentActivity
    });

  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get available internships
router.get('/internships', authenticateToken, async (req, res) => {
  try {
    const internships = await Internship.find({ isActive: true })
      .populate('employerId', 'name')
      .sort({ createdAt: -1 });

    res.json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Apply for internship
router.post('/apply', authenticateToken, async (req, res) => {
  try {
    const { internshipId, coverLetter } = req.body;
    const studentId = req.user.userId;

    // Check if already applied
    const existingApplication = await Application.findOne({ studentId, internshipId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this internship' });
    }

    // Create application
    const application = new Application({
      studentId,
      internshipId,
      coverLetter
    });

    await application.save();

    // Update internship application count
    await Internship.findByIdAndUpdate(internshipId, {
      $inc: { applicationCount: 1 }
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;