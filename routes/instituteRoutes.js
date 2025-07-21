const express = require('express');
const instituteController = require('../controllers/instituteController');
const router = express.Router();

// Route to render the institute sign-up page
router.get('/signup', (req, res) => {
    res.render('institute/signup'); // Renders 'views/institute/signup.ejs'
});

// Route to handle the institute sign-up form submission
router.post('/signup', instituteController.signup);

// Route to render the institute login page
router.get('/login', (req, res) => {
    res.render('/home'); // Renders 'views/institute/login.ejs'
});

// Route to handle the institute login form submission
router.post('/login', instituteController.login);

router.get('/dashboard', instituteController.isAuthenticated, instituteController.dashboard);

// Route to handle logout
router.get('/logout', instituteController.logout);

//Route to render add internship page
router.get('/addInternship', (req, res) => {
    res.render('institute/addInternship');
});

//Route to handle add internship form submission
router.post('/addInternship', instituteController.addInternship);


module.exports = router;
