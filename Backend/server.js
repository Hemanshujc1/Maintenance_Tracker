const dotenv = require('dotenv');
dotenv.config(); // Load env vars first

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
// Removed duplicate auth route
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Database Connection and Server Start
const PORT = process.env.PORT || 5000;

console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connected successfully.');

    // Sync models (alter: true updates schema without data loss)
    await sequelize.sync({ alter: true });
    console.log('Database synced.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
