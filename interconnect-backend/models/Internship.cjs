const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  location: { type: String, required: true },
  duration: { type: String, required: true },
  stipend: { type: Number, default: 0 },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Use 'employer'
  status: { type: String, enum: ['active', 'inactive', 'closed'], default: 'active' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Internship', internshipSchema);