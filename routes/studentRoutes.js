const express = require('express');
const path = require('path');
const studentController = require('../controllers/studentController');
const router = express.Router();


// Route to render the sign-up page (GET)
router.get('/signup', (req, res) => {
    res.render('student/signup');
});

// Route to handle the sign-up form submission (POST)
router.post('/signup', studentController.signup);


// Route to render the login page (GET)
router.get('/login', (req, res) => {
    res.render('/home');
});

// Route to handle the login form submission (POST)
router.post('/login', studentController.login);

// Route to render the dashboard (GET)
router.get('/dashboard', studentController.isAuthenticated, (req, res) => {
    // Pass a student object to the dashboard view
    // console.log('Session Data in Dashboard Route:', req.session);

    res.render('student/dashboard', {
        student: {
            firstName: req.session.studentName,
            email: req.session.studentEmail
        }
    });
});

// studentController.js

exports.isAuthenticated = (req, res, next) => {
    if (req.session.studentId) {
        // If student is authenticated, proceed to the next route handler
        return next();
    } else {
        // If not authenticated, redirect to the home page
        res.redirect('/home');
    }
};


// Route to handle logout
router.get('/logout', studentController.logout);

// Internship

// Route to render the application form with internship title
router.get('/apply-internship/:title', studentController.applyInternshipForm);

// Route to handle internship application submission
router.post('/apply-internship/:title', studentController.applyInternship);


// Courses

// Route to render the application form with internship title
router.get('/apply-course/:title', studentController.applyCourseForm);

// Route to handle internship application submission
router.post('/apply-course/:title', studentController.applyCourse);


module.exports = router;
