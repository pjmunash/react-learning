const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log('📝 Registration attempt:', { name, email, role });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    // Generate token - USE 'id' not 'userId'
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Changed userId to id
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' } // Extended to 24h
    );

    console.log('✅ User registered successfully:', user.email);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', email);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token - USE 'id' not 'userId'
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Changed userId to id
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' } // Extended to 24h
    );

    console.log('✅ User logged in successfully:', user.email);
    console.log('Token payload:', { id: user._id, email: user.email, role: user.role }); // Debug log

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Test auth route for debugging
router.get('/test-auth', require('../middleware/auth.cjs'), (req, res) => {
  res.json({
    message: 'Authentication working!',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Debug route to check database contents
router.get('/debug-data', async (req, res) => {
  try {
    const User = require('../models/User.cjs');
    const Internship = require('../models/Internship.cjs');
    const Application = require('../models/Application.cjs');

    const users = await User.find().select('-password');
    const internships = await Internship.find().populate('employer', 'name email');
    const applications = await Application.find()
      .populate('student', 'name email')
      .populate('internship', 'title company');

    res.json({
      totalUsers: users.length,
      totalInternships: internships.length,
      totalApplications: applications.length,
      users: users,
      internships: internships,
      applications: applications
    });
  } catch (error) {
    console.error('Debug data error:', error);
    res.status(500).json({ message: 'Error fetching debug data' });
  }
});

// Add to interconnect-backend/routes/auth.cjs for testing:
router.post('/create-test-data', async (req, res) => {
  try {
    const User = require('../models/User.cjs');
    const Internship = require('../models/Internship.cjs');
    const Application = require('../models/Application.cjs');
    const bcrypt = require('bcryptjs');

    // Create test users if they don't exist
    const testStudent = await User.findOneAndUpdate(
      { email: 'student@test.com' },
      {
        name: 'Test Student',
        email: 'student@test.com',
        password: await bcrypt.hash('password123', 12),
        role: 'student'
      },
      { upsert: true, new: true }
    );

    const testEmployer = await User.findOneAndUpdate(
      { email: 'employer@test.com' },
      {
        name: 'Test Employer',
        email: 'employer@test.com',
        password: await bcrypt.hash('password123', 12),
        role: 'employer'
      },
      { upsert: true, new: true }
    );

    // Create test internship
    const testInternship = await Internship.findOneAndUpdate(
      { title: 'Test Software Intern' },
      {
        title: 'Test Software Intern',
        company: 'Test Company',
        description: 'Test internship description',
        requirements: ['JavaScript', 'React'],
        location: 'Remote',
        duration: '3 months',
        stipend: 1000,
        employer: testEmployer._id,
        status: 'active'
      },
      { upsert: true, new: true }
    );

    // Create test application
    await Application.findOneAndUpdate(
      { student: testStudent._id, internship: testInternship._id },
      {
        student: testStudent._id,
        internship: testInternship._id,
        coverLetter: 'Test cover letter',
        status: 'pending'
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Test data created successfully' });
  } catch (error) {
    console.error('Error creating test data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add to interconnect-backend/routes/auth.cjs
router.get('/debug-all-data', async (req, res) => {
  try {
    const User = require('../models/User.cjs');
    const Internship = require('../models/Internship.cjs');
    const Application = require('../models/Application.cjs');

    const users = await User.find().select('-password');
    const internships = await Internship.find().populate('employer', 'name email');
    const applications = await Application.find()
      .populate('student', 'name email')
      .populate('internship', 'title company');

    console.log('=== DEBUG DATA ===');
    console.log('Users:', users.length);
    console.log('Internships:', internships.length);
    console.log('Applications:', applications.length);

    res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalInternships: internships.length,
        totalApplications: applications.length
      },
      data: {
        users: users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role })),
        internships: internships.map(i => ({ 
          id: i._id, 
          title: i.title, 
          company: i.company, 
          employer: i.employer?.name || 'Unknown'
        })),
        applications: applications.map(a => ({ 
          id: a._id, 
          student: a.student?.name || 'Unknown',
          internship: a.internship?.title || 'Unknown'
        }))
      }
    });
  } catch (error) {
    console.error('Debug data error:', error);
    res.status(500).json({ message: 'Error fetching debug data', error: error.message });
  }
});

module.exports = router;


