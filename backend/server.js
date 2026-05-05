const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const admin_route = require('./routes/AdminRoute.js');
const visitor_route = require('./routes/VisitorRoute.js');
const employee_route = require('./routes/EmployeeRoute.js');
const frontdesk_route = require('./routes/FrontdeskRoute.js');
const preregister_route = require('./routes/PreregisterRoute.js');

const app = express();

// CORS – in production, replace * with your frontend URL
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://assignment-9-tutedude.vercel.app',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Admin routes
app.use('/api/admin', admin_route);

// Visitor routes
app.use('/api/register/visitor', visitor_route);
app.use('/api/get/visitors/details', visitor_route);
app.use('/api/update/visitors/details', visitor_route);
app.use('/api/delete/visitors/details', visitor_route);

// Preregister routes
app.use('/api/register/preregister', preregister_route);
app.use('/api/get/preregister/details', preregister_route);
app.use('/api/update/preregister/details', preregister_route);
app.use('/api/delete/preregister/details', preregister_route);

// Employee routes
app.use('/api/register/employee', employee_route);
app.use('/api/get/employees/details', employee_route);
app.use('/api/update/employees/details', employee_route);
app.use('/api/delete/employees/details', employee_route);

// Frontdesk routes
app.use('/api/check/in/out', frontdesk_route);
app.use('/api/get/all/check/in/out/details', frontdesk_route);
app.use('/api/get/check/in/out/details', frontdesk_route);
app.use('/api/get/check/in/out', frontdesk_route);
app.use('/api/update/check/in/out/details', frontdesk_route);
app.use('/api/delete/check/in/out/details', frontdesk_route);

// Catch-all 404 for /api – helps distinguish wrong path vs wrong domain
app.use('/api', (req, res) => {
  res.status(404).json({
    message: 'API route not found',
    path: req.originalUrl,
  });
});

// Start server after Mongo connects
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('.........MongoDB Connected Successfully.........');

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed ❌', error);
    process.exit(1);
  }
}

startServer();
