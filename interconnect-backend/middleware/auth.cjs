const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    console.log('🔍 Authenticating token for:', req.path);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    console.log('✅ Token decoded:', { id: decoded.id, email: decoded.email, role: decoded.role });
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('❌ User not found for ID:', decoded.id);
      return res.status(401).json({ message: 'Token is not valid - user not found' });
    }

    console.log('✅ User authenticated:', user.email, user.role);
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;