const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship.cjs');
const Application = require('../models/Application.cjs');
const auth = require('../middleware/auth.cjs'); // Use consistent auth middleware

// Employer dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied. Employers only.' });
    }

    const employerId = req.user._id; // Consistent with auth middleware
    
    // Get employer statistics
    const internships = await Internship.countDocuments({ employer: employerId });
    const activeInternships = await Internship.countDocuments({ employer: employerId, status: 'active' });
    
    const employerInternships = await Internship.find({ employer: employerId });
    const internshipIds = employerInternships.map(i => i._id);
    
    const applications = await Application.countDocuments({ internship: { $in: internshipIds } });
    const pendingApplications = await Application.countDocuments({ 
      internship: { $in: internshipIds }, 
      status: 'pending' 
    });

    // Get recent activity (recent applications)
    const recentActivity = await Application.find({ internship: { $in: internshipIds } })
      .populate('student', 'name email')
      .populate('internship', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedActivity = recentActivity.map(app => ({
      id: app._id,
      title: `New application for ${app.internship.title}`,
      student: app.student.name,
      role: app.internship.title,
      time: app.createdAt
    }));

    res.json({
      stats: {
        internships,
        activeInternships,
        applications,
        pendingApplications
      },
      recentActivity: formattedActivity
    });
  } catch (error) {
    console.error('Error fetching employer dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Post new internship
router.post('/internships', auth, async (req, res) => {
  try {
    console.log('📝 Posting internship for user:', req.user.email);
    console.log('📝 Internship data:', req.body);
    
    const { title, company, description, requirements, location, duration, stipend } = req.body;
    
    // Validate required fields
    if (!title || !company || !description || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const employerId = req.user._id;

    const internship = new Internship({
      title,
      company,
      description,
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      location,
      duration,
      stipend: Number(stipend) || 0,
      employer: employerId,
      status: 'active'
    });

    const savedInternship = await internship.save();
    console.log('✅ Internship saved:', savedInternship._id);
    
    // Populate the employer data
    await savedInternship.populate('employer', 'name email');
    
    res.status(201).json({ 
      message: 'Internship posted successfully', 
      internship: savedInternship 
    });
  } catch (error) {
    console.error('❌ Error posting internship:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get applications for employer's internships
router.get('/applications', auth, async (req, res) => {
  try {
    console.log('Fetching applications for employer:', req.user._id);
    const employerId = req.user._id;
    
    const internships = await Internship.find({ employer: employerId });
    const internshipIds = internships.map(internship => internship._id);
    
    console.log('Found internships:', internshipIds);
    
    const applications = await Application.find({ 
      internship: { $in: internshipIds } 
    })
    .populate('student', 'name email')
    .populate('internship', 'title company location')
    .sort({ createdAt: -1 });
    
    console.log('Found applications:', applications.length);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status
router.patch('/applications/:applicationId/status', auth, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const employerId = req.user._id;
    
    const application = await Application.findById(applicationId)
      .populate('internship');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    if (application.internship.employer.toString() !== employerId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    application.status = status;
    await application.save();
    
    res.json({ message: `Application ${status} successfully`, application });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;