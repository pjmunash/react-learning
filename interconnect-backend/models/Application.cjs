const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  coverLetter: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'interview'], 
    default: 'pending' 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);