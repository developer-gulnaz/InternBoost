const express = require('express');
const mongoose = require('mongoose'); 
const MongoStore = require('connect-mongo');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const studentRoutes = require('./routes/studentRoutes');
const instituteRoutes = require('./routes/instituteRoutes');
const commonRoutes = require('./routes/commonRoutes');
const flash = require('connect-flash');
require('dotenv').config();
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session configuration

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
}));

//Middleware to Pass Session Data Globally

app.use((req, res, next) => {
  res.locals.instituteName = req.session?.instituteName || null;
  res.locals.studentName = req.session?.studentName || null;
  res.locals.internshipTitle = req.session?.internshipTitle || null;
  res.locals.appliedInternships = req.session?.appliedInternships || null;
  res.locals.appliedCourses = req.session?.appliedCourses || null;
  res.locals.message = req.session?.message || null;
  next();
});

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err);
  process.exit(1); // Exit app if DB fails to connect
});

// Use the student routes
app.use('/', commonRoutes);
app.use('/student', studentRoutes);
app.use('/institute', instituteRoutes);

// app.use((req, res, next) => {
//   console.log(`${req.method} request to ${req.url}`);
//   next();
// });

app.use((req, res, next) => {
  if (req.session) {
      const now = Date.now();
      const maxInactive = 15 * 60 * 1000; // 15 minutes in milliseconds

      // Initialize lastActivity if not set
      if (!req.session.lastActivity) {
          req.session.lastActivity = now;
      }

      // Check if session has expired
      if (now - req.session.lastActivity > maxInactive) {
          req.session.destroy((err) => {
              if (err) {
                  console.error(err);
              }
              return res.redirect('/home'); // Redirect to login page
          });
      } else {
          // Update lastActivity on every request
          req.session.lastActivity = now;
      }
  }
  next();
});


// Catch-all for undefined routes
app.use((req, res) => {
  req.flash('error', 'The page you are looking for does not exist.');
  res.redirect('/');
});


// Start the server
// With this:
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
