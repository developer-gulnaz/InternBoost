const mongoose = require('mongoose');

const appliedCourseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false },
  courseTitle: { type: String, required: true },  // Store Course title directly
  resume: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: false },
  mobile: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now }
}, { collection: 'appliedCourses' });

module.exports = mongoose.model('AppliedCourse', appliedCourseSchema);
