const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');
const Application = require('../models/Application.cjs');
const Internship = require('../models/Internship.cjs');
const auth = require('../middleware/auth.cjs');

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
router.get('/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    const studentId = req.user._id;
    
    // Get application counts by status
    const totalApplications = await Application.countDocuments({ student: studentId });
    const interviews = await Application.countDocuments({ student: studentId, status: 'interview' });
    const offers = await Application.countDocuments({ student: studentId, status: 'accepted' });

    // Get recent applications for activity feed
    const recentApplications = await Application.find({ student: studentId })
      .populate('internship', 'title company')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentActivity = recentApplications.map(app => ({
      id: app._id,
      title: `Applied to ${app.internship?.title || 'Internship'}`,
      company: app.internship?.company || 'Company',
      role: app.internship?.title || 'Position',
      status: app.status,
      time: app.createdAt
    }));

    const stats = {
      applications: totalApplications,
      interviews: interviews,
      offers: offers,
      profileViews: Math.floor(Math.random() * 50) + 10 // Mock data for profile views
    };

    res.json({ stats, recentActivity });
  } catch (error) {
    console.error('Error fetching student dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available internships for students
router.get('/internships', auth, async (req, res) => {
  try {
    console.log('📋 Fetching internships for student:', req.user.email);
    
    const internships = await Internship.find({ status: 'active' })
      .populate('employer', 'name email')
      .sort({ createdAt: -1 });
    
    console.log('📋 Found internships:', internships.length);
    
    res.json(internships);
  } catch (error) {
    console.error('❌ Error fetching internships:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit application
router.post('/applications', auth, async (req, res) => {
  try {
    const { internshipId, coverLetter } = req.body;
    const studentId = req.user._id;

    // Check if already applied
    const existingApplication = await Application.findOne({
      student: studentId,
      internship: internshipId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this internship' });
    }

    const application = new Application({
      student: studentId,
      internship: internshipId,
      coverLetter,
      status: 'pending'
    });

    await application.save();
    
    res.status(201).json({ 
      message: 'Application submitted successfully', 
      application 
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    // You can extend the User model or create a separate Profile model
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student profile
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    const {
      name,
      email,
      phone,
      skills,
      bio,
      education,
      experience,
      portfolio,
      linkedin,
      github
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        email,
        phone,
        skills,
        bio,
        education,
        experience,
        portfolio,
        linkedin,
        github
      },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's application history
router.get('/applications', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    const applications = await Application.find({ student: req.user._id })
      .populate('internship', 'title company location duration stipend')
      .sort({ createdAt: -1 });

    console.log('📋 Found applications for student:', applications.length);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching application history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;