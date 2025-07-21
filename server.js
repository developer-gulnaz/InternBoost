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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Session must come BEFORE flash()
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
}));

// ✅ Flash middleware AFTER session
app.use(flash());

// Middleware to pass session data globally
app.use((req, res, next) => {
  res.locals.instituteName = req.session?.instituteName || null;
  res.locals.studentName = req.session?.studentName || null;
  res.locals.internshipTitle = req.session?.internshipTitle || null;
  res.locals.appliedInternships = req.session?.appliedInternships || null;
  res.locals.appliedCourses = req.session?.appliedCourses || null;
  res.locals.message = req.session?.message || null;
  res.locals.messages = req.flash(); // Move this here for clarity
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
  process.exit(1);
});

// Routes
app.use('/', commonRoutes);
app.use('/student', studentRoutes);
app.use('/institute', instituteRoutes);

// Session expiration middleware
app.use((req, res, next) => {
  if (req.session) {
    const now = Date.now();
    const maxInactive = 15 * 60 * 1000;

    if (!req.session.lastActivity) {
      req.session.lastActivity = now;
    }

    if (now - req.session.lastActivity > maxInactive) {
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
          return next(); // fallback to next middleware if destroy fails
        }
        if (!res.headersSent) {
          return res.redirect('/home');
        }
      });
    } else {
      req.session.lastActivity = now;
      next();
    }
  } else {
    next();
  }
});

// Catch-all route
app.use((req, res) => {
  if (!res.headersSent) {
    req.flash('error', 'The page you are looking for does not exist.');
    return res.redirect('/');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
