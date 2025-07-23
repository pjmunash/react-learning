const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.cjs');
const User = require('../models/User.cjs');
const Internship = require('../models/Internship.cjs');
const Application = require('../models/Application.cjs');

// Admin dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    console.log('📊 Admin dashboard request from:', req.user.email);
    
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
    
    console.log('📊 Stats:', { totalUsers, totalStudents, totalEmployers, totalInternships, totalApplications });

    // Get recent users (last 10)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role createdAt');

    // Get recent internships (last 10)
    const recentInternships = await Internship.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('employer', 'name email')
      .select('title company location createdAt employer');

    const responseData = {
      stats: {
        totalUsers,
        totalStudents,
        totalEmployers,
        totalInternships,
        totalApplications
      },
      recentUsers,
      recentInternships
    };

    console.log('📊 Admin response:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('❌ Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (Admin only)
router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system analytics (Admin only)
router.get('/analytics', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalInternships = await Internship.countDocuments();
    const totalApplications = await Application.countDocuments();

    // Get users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Get applications by status
    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Format the data
    const userRoleData = { student: 0, employer: 0, admin: 0 };
    usersByRole.forEach(item => {
      userRoleData[item._id] = item.count;
    });

    const applicationStatusData = { pending: 0, accepted: 0, rejected: 0, interview: 0 };
    applicationsByStatus.forEach(item => {
      applicationStatusData[item._id] = item.count;
    });

    // Get recent activity (simplified)
    const recentUsers = await User.find({}).sort({ createdAt: -1 }).limit(3).select('name role createdAt');
    const recentInternships = await Internship.find({}).sort({ createdAt: -1 }).limit(2).select('title company createdAt').populate('employer', 'name');
    
    const recentActivity = [
      ...recentUsers.map(user => ({
        type: 'user_registered',
        message: `New ${user.role} ${user.name} registered`,
        time: user.createdAt
      })),
      ...recentInternships.map(internship => ({
        type: 'internship_posted',
        message: `${internship.company} posted ${internship.title}`,
        time: internship.createdAt
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

    res.json({
      totalUsers,
      totalInternships,
      totalApplications,
      usersByRole: userRoleData,
      applicationsByStatus: applicationStatusData,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;