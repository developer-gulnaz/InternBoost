const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    internshipName: {
        type: String,
        required: true
    },
    internshipDescription: {
        type: String,
        required: true
    },
    internshipDuration: {
        type: String,
        required: true
    },
    internshipStipend: {
        type: Number,
        required: true
    },
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
    internshipImage: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);
