const express = require('express');// import express for server establishment
const bcrypt = require('bcryptjs');//import for password hashing
const db = require('./config/db');// import database connection
const bodyParser = require('body-parser');//import to parse incoming requests
const path = require('path');//to configure current directorie
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();// extract env 

const app = express();//define express middleware
const port = 3000;//define the port

// Middleware
app.use(express.json()); //use express middleware
app.use(bodyParser.urlencoded({ extended: false }));//parse the incoming requests that are URL encoded
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





