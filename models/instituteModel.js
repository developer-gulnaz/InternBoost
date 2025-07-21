const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    internships: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship'  // Refers to Internship model
    }],
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'  // Refers to Course model
    }]
}, { timestamps: true });


module.exports = mongoose.model('Institute', instituteSchema);
