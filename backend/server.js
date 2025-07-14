const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');
const authRoutes = require('./router/registerRoutes'); // Corrected path
const authRoutess = require('./router/loginRoutes'); // Corrected path
const authRoutesss = require('./router/googleRoutes'); // Corrected path
const errorHandler = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize app AFTER declaring all modules
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat', // Use env for production
    resave: false,
    saveUninitialized: false,
}));

// Passport config
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', authRoutess);
app.use('/api/auth', authRoutesss);

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
