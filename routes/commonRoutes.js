const express = require('express');
const path = require('path');
const router = express.Router();
const Internship = require('../models/internshipModel')


router.get('/home', async (req, res) => {
    try {
        const internships = await Internship.find(); // Fetch all internships from the collection
        res.render('home', { internships });
    } catch (error) {
        res.status(500).send('Error fetching data.');
    }
});
router.get('/', async (req, res) => {
    try {
        const internships = await Internship.find(); // Fetch all internships from the collection
        res.render('home', { internships });
    } catch (error) {
        res.status(500).send('Error fetching data.');
    }
});



module.exports = router;