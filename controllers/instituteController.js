const bcrypt = require('bcryptjs');
const Institute = require('../models/instituteModel');

// Controller for institute sign-up
exports.signup = async (req, res) => {
    const { name, email, mobile, password, } = req.body;

    let errorMessage = '';

    // Validate required fields
    if (!name || !email || !mobile || !password) {
        req.flash('error', 'All fields are required');
        return res.render('institute/signup');
    }
    try {
        // Check if the institute already exists
        const existingInstitute = await Institute.findOne({ email });
        if (existingInstitute) {
            req.flash('error', 'Institute with this email already exists');
            return res.render('institute/signup');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new institute instance
        const institute = new Institute({
            name,
            email,
            mobile,
            password: hashedPassword,
        });

        // Save the institute to the database
        await institute.save();
        req.flash('success', 'Sign up successful! Please log in.');
        // Redirect to the login page
        res.redirect('/');
    } catch (error) {
        console.error('Error during institute signup:', error);
        req.flash('error', 'Internal Server Error');
        res.render('/institute/signup');
    }
};

// Controller for handling institute login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the institute by email
        const institute = await Institute.findOne({ email });
        if (!institute) {
            req.flash('error', 'Institute not found');
            return res.redirect('/');  // Redirect to the login page
        }

        // Compare the entered password with the hashed password stored in DB
        const isMatch = await bcrypt.compare(password, institute.password);
        if (!isMatch) {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/');  // Redirect to the login page
        }

        // Set session variables for the logged-in institute
        req.session.instituteId = institute._id;
        req.session.instituteName = institute.name;
        req.session.instituteEmail = institute.email;
        req.session.instituteMobile = institute.mobile;

        // Set a success flash message and redirect to the dashboard
        req.flash('success', 'Login Successful!');
        return res.redirect('/institute/dashboard');
    } catch (error) {
        console.error('Error during institute login:', error);
        req.flash('error', 'Internal Server Error');
        return res.redirect('/');  // Redirect to login page on error
    }
};


// Controller for institute dashboard
exports.dashboard = async (req, res) => {
    if (!req.session.instituteId) {
        return res.redirect('/');
    }

    try {
        const institute = await Institute.findById(req.session.instituteId);
        if (!institute) {
            return res.redirect('/');
        }
        res.render('institute/dashboard', {
            institute,
            successMessage: req.flash('success'),
            errorMessage: req.flash('error')
        });
    } catch (error) {
        console.error('Error in institute dashboard:', error);
        req.flash('error', 'Internal Server Error');
        res.redirect('/');
    }
};


// Controller for handling student logout
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
