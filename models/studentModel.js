const mongoose = require('mongoose');

// Define the schema for the Student
const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true},
  password: { type: String, required: true }
});

// Create the Student model
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
