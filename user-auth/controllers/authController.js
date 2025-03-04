const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {

  checkUsernameExists,
  registerUser,
  checkEmailExists,
} = require('./userController');

const {validateUsername,
  validatePassword,validateEmail}=require('../utils/validation');

dotenv.config();

const register = async (req, res) => {
    const { first_name, Last_name, email,password,created_at} = req.body;
  
    // Validate username
    if (!validateUsername(first_name,Last_name)) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long and contain only letters and numbers.' });
    }
  
    // Validate password
    if (!validatePassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long and contain at least one number and one special character.',
      });
    }
    //validate email
    if(!validateEmail(email)){
      return res.status(400).json({
        error:'Email is not matching a correct format',
      });
    }
  
    // Check if username already exists
    const usernameExists = await checkUsernameExists(first_name,Last_name);
    if (usernameExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ error: "This email's user already exists!" });
    }
  
  
    
    // Register the user
    try {
      await registerUser(first_name,Last_name, password,email);
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to register user.' });
    }
  };
  
  
  
  module.exports = { register };