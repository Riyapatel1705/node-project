const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db=require('../config/db');
const {validateEmail, registerUser,checkEmailExists}=require('../controllers/userController');

router.post('/register', async (req, res) => {
    const { first_name, Last_name, password, email } = req.body;
  
    // Check if all required fields are provided
    if (!first_name || !Last_name || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Validate the email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Check if the email already exists
      const emailExists = await checkEmailExists(email);  // Assuming checkEmailExists is in your User model
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // Create user in the database
      await registerUser(first_name,Last_name,password,email);
      // Respond with success
      res.status(201).json({ message: 'User registered successfully' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error registering user' });
    }
  });

  module.exports = router;

