const bcrypt = require('bcryptjs');
const Institute = require('../models/instituteModel');
const Internship = require('../models/internshipModel')
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: './uploads/internshipImages',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// File filter to allow only image uploads
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        req.flash('error', 'Only JPEG, JPG, and PNG images are allowed!');
        cb(null, false);
    }
};

// Multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});


// Controller for institute sign-up
exports.signup = async (req, res) => {
    const { name, email, mobile, password, } = req.body;

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
        return res.redirect('/'); // Redirect to home if not logged in
    }

    try {
        // Fetch the institute's details and associated internships
        const institute = await Institute.findById(req.session.instituteId);
        if (!institute) {
            req.flash('error', 'Institute not found. Please log in again.');
            return res.redirect('/');
        }

        const internships = await Internship.find({ instituteId: req.session.instituteId });

        // Render the dashboard view with the necessary data
        res.render('institute/dashboard', {
            institute: {
                name: institute.name,
                email: institute.email,
            },
            internships,
            successMessage: req.flash('success'),
            errorMessage: req.flash('error')
        });
    } catch (error) {
        console.error('Error in institute dashboard:', error);
        req.flash('error', 'Internal Server Error');
        res.render('institute/dashboard', {
            institute: {
                name: req.session.instituteName || 'Unknown',
                email: req.session.instituteEmail || 'Unknown',
            },
            internships: [],
            successMessage: null,
            errorMessage: 'Internal Server Error'
        });
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

exports.addInternship = [
    upload.single('internshipImg'), // Middleware to handle file upload
    async (req, res) => {
        const { internshipName, internshipDescription, internshipDuration, internshipLocation, internshipStipend } = req.body;
        const internshipImage = req.file ? req.file.filename : null;

        // Validate required fields
        if (!internshipName || !internshipDescription || !internshipDuration || !internshipLocation || !internshipStipend || !internshipImage) {
            req.flash('error', 'All fields are required');
            return res.redirect('/institute/addInternship');
        }

        try {
            const instituteId = req.session.instituteId || null;

            // Save internship to the database
            await Internship.create({
                internshipName,
                internshipDescription,
                internshipDuration,
                internshipLocation,
                internshipStipend,
                internshipImage,
                instituteId,
            });

            req.flash('success', 'Internship added successfully!');
            return res.redirect('/institute/dashboard');
        } catch (error) {
            console.error('Error adding internship:', error);
            req.flash('error', 'There was an error adding the internship. Please try again.');
            return res.redirect('/institute/addInternship');
        }
    }
];


// exports.deleteInternship = (req, res) => {
//     try {
//         const internshipId = req.params.internshipId;
//         Internship.findByIdAndRemove(internshipId, (err, internship) => {
//             if (err) {
//                 console.error('Error deleting internship:', err);
//                 req.flash('error', 'Failed to delete internship');
//                 return res.redirect('/institute/dashboard');
//             }
//             req.flash('success', 'Internship deleted successfully');
//             return res.redirect('/institute/dashboard');
//         });
//     } catch (error) {
//         console.error('Error deleting internship:', error);
//         req.flash('error', 'Failed to delete internship');
//         res.redirect('/institute/dashboard');
//     }
// };


exports.getInternship = (req, res) => {
    try {
        const internshipId = req.params.internshipId;
        Internship.findById(internshipId, (err, internshipId));
        if (err) {
            console.error('Error fetching internship:', err);
            req.flash('error', 'Failed to fetch internship');
            return res.redirect('/institute/dashboard');
        }
        res.render('institute/internship', { internship });
    } catch (error) {
        console.error('Error fetching internship:', error);
        req.flash('error', 'Failed to fetch internship');
        res.redirect('/institute/dashboard');
    }
};


exports.updateInternship = (req, res) => {
    upload.single('internshipImage');
    try {
        const internshipId = req.params.internshipId;
        const instituteId = req.params.instituteId;
        const { internshipName, internshipDescription, internshipDuration, internshipLocation, internshipStipend } = req.body
        Internship.findByIdAndUpdate(internshipId, {
            internshipName, internshipDescription, internshipDuration, internshipLocation, internshipStipend, instituteId

        }, (err, internship) => {
            if (err) {
                console.error('Error updating internship:', err);
                req.flash('error', 'Failed to update internship');
                return res.redirect('/institute/dashboard');
            }
            req.flash('success', 'Internship updated successfully');
            return res.redirect('/institute/dashboard');
        });
    } catch (error) {
        console.error('Error updating internship:', error);
        req.flash('error', 'Failed to update internship');
        res.redirect('/institute/dashboard');
    }
};

// Middleware to check if the student is logged in
exports.isAuthenticated = (req, res, next) => {
    if (req.session.instituteId) {
        return next();
    } else {
        req.flash('error', 'You need to be logged in to access this page');
        res.redirect('/');
    }
};