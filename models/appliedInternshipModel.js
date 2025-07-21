// const mongoose = require('mongoose');

// const appliedInternshipSchema = new mongoose.Schema({
//     studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false },
//     internshipTitle: { type: String, required: true },  // Store internship title directly
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true, unique: false },
//     mobile: { type: String, required: true },
//     resume: { type: String, required: true },
//     appliedAt: { type: Date, default: Date.now }
// }, { collection: 'appliedInternships' });

// module.exports = mongoose.model('AppliedInternship', appliedInternshipSchema);



const mongoose = require('mongoose');

const appliedInternshipSchema = new mongoose.Schema({
    internshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    progress: {
        type: String,
        default: 'Applied'
    }
}, { timestamps: true });

module.exports = mongoose.model('AppliedInternship', appliedInternshipSchema);
