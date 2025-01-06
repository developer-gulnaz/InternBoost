const bcrypt = require('bcryptjs');
const Student = require('../models/studentModel');
const AppliedInternship = require('../models/appliedInternshipModel');
const AppliedCourse = require('../models/appliedCourseModal');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Middleware for file upload (Multer configuration)
const storage = multer.diskStorage({
    destination: './uploads/resumes',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// File filter to only allow PDF and DOCX files
const fileFilter = (req, file, cb) => {
    // Check file type for PDF and DOCX
    const allowedFileTypes = /pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        req.flash('error', 'Only PDF and DOCX files are allowed!');
        return cb(null, false);
    }
};

// Create multer instance with file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

// Student Sign Up
exports.signup = async (req, res) => {
    const { firstName, lastName, email, mobile, password } = req.body;
    if (!firstName || !lastName || !email || !mobile || !password) {
        req.flash('error', 'All fields are required');
        return res.render('student/signup');
    }

    try {
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            req.flash('error', 'Student with this email already exists');
            return res.render('student/signup');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const student = new Student({ firstName, lastName, email, mobile, password: hashedPassword });

        await student.save();
        req.flash('success', 'Sign up successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error during signup:', error);
        req.flash('error', 'Internal Server Error');
        res.render('student/signup');
    }
};

// Student Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the student by email
        const student = await Student.findOne({ email });
        if (!student) {
            req.flash('error', 'Student not found');
            return res.redirect('/');
        }

        // Compare the entered password with the hashed password stored in DB
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/');
        }

        // Set the session variables on successful login
        req.session.studentId = student._id;
        req.session.studentName = student.firstName;
        req.session.studentEmail = student.email;
        req.session.studentMobile = student.mobile;

        // Flash success message and redirect to the dashboard
        req.flash('success', 'Login Successful!');
        return res.redirect('/student/dashboard');
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'Internal Server Error');
        return res.redirect('/');  // Redirect back to home or login page
    }
};


// Student Dashboard
exports.dashboard = async (req, res) => {
    // Check if the student is logged in by verifying the session
    if (!req.session.studentId) {
        req.flash('error', 'Please log in first');
        return res.redirect('/');
    }

    try {
        // Fetch student details from the Student model
        const student = await Student.findById(req.session.studentId);
        if (!student) {
            req.flash('error', 'No student found');
            return res.redirect('/');
        }

        // Fetch the applied internships and courses for the logged-in student
        const appliedInternships = await AppliedInternship.find({ studentId: req.session.studentId });
        const appliedCourses = await AppliedCourse.find({ studentId: req.session.studentId });

        // Render the dashboard with student data and applied internships
        res.render('student/dashboard', {
            student,
            appliedInternships,
            appliedCourses,
            successMessage: req.flash('success'),
            errorMessage: req.flash('error')
        });
    } catch (error) {
        console.error('Error fetching data for dashboard:', error);
        req.flash('error', 'Internal Server Error');
        res.redirect('/');
    }
};

// Middleware to check if the student is logged in
exports.isAuthenticated = (req, res, next) => {
    if (req.session.studentId) {
        return next();
    } else {
        req.flash('error', 'You need to be logged in to access this page');
        res.redirect('/');
    }
};

// Student Logout
exports.logout = (req, res) => {
    try {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.error('Error during logout:', err);
                return res.status(500).send('An error occurred during logout.');
            }

            // Redirect to the home page
            res.redirect('/');
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).send('An error occurred.');
    }
};

// Display Internship Application Form
exports.applyInternshipForm = async (req, res) => {
    const internshipTitle = req.params.title;
    const student = await Student.findById(req.session.studentId);
    res.render('student/applyInternship', { title: internshipTitle, student });
};

// Submit Internship Application
exports.applyInternship = [
    upload.single('resume'), // Middleware to handle file upload
    async (req, res) => {
        const internshipTitle = req.params.title;
        const { firstName, lastName, email, mobile } = req.body;
        const resume = req.file ? req.file.filename : null;

        if (!firstName || !lastName || !email || !mobile || !resume) {
            req.flash('error', 'All fields are required');
            return res.redirect('/student/apply-internship/' + internshipTitle);
        }

        try {
            const studentId = req.session.studentId || null;

            // Save internship application to the database
            await AppliedInternship.create({
                studentId,
                internshipTitle,
                firstName,
                lastName,
                email,
                mobile,
                resume,
            });

            req.flash('success', 'Internship application submitted successfully!');
            if (studentId) {
                return res.redirect('/student/dashboard');
            } else {
                return res.redirect('/');
            }
        } catch (error) {
            console.error('Error saving internship application:', error);
            req.flash('error', 'There was an error submitting your application. Please try again.');
            return res.redirect('/student/apply-internship/' + internshipTitle);
        }
    }
];

// Display Course Application Form
exports.applyCourseForm = async (req, res) => {
    const courseTitle = req.params.title;
    const student = await Student.findById(req.session.studentId);
    res.render('student/applyCourse', { title: courseTitle, student });
};

// Submit Course Application
exports.applyCourse = [
    upload.single('resume'),
    async (req, res) => {
        const courseTitle = req.params.title;
        const { firstName, lastName, email, mobile } = req.body;
        const resume = req.file ? req.file.filename : null;

        // Check if all required fields are provided
        if (!firstName || !lastName || !email || !mobile || !resume) {
            req.flash('error', 'All required fields must be filled!');
            return res.redirect('/student/apply-course/' + courseTitle);
        }

        try {
            // Check if student is logged in (use session)
            const studentId = req.session.studentId || null;

            // Save the course application to the database
            await AppliedCourse.create({
                studentId,
                courseTitle,
                resume,
                firstName,
                lastName,
                email,
                mobile,
            });

            // Set success message and redirect
            req.flash('success', 'Course application submitted successfully!');
            if (studentId) {
                return res.redirect('/student/dashboard');
            } else {
                return res.redirect('/');
            }
        } catch (error) {
            console.error('Error saving course application:', error);
            req.flash('error', 'There was an error submitting your application. Please try again.');
            return res.redirect('/student/apply-course/' + courseTitle);
        }
    }
];
