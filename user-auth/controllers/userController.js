const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Validate username
const validateUsername = (first_name,Last_name) => {
    const regex1 = /^[a-zA-Z]{3,}$/; // Alphanumeric, at least 3 characters
    const regex2=/^[a-zA-Z]{4,}$/;
    const isCorrect=(first_name,Last_name)=>{
       return regex1.test(first_name) && regex2.test(Last_name);
      }
    
    if(isCorrect(first_name,Last_name)){
      return true;
    }
    return false;
    
  };
  
  // Validate password
  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}$/; // At least 6 characters, one number, one special character
    return regex.test(password);
  };
  
  // Check if username already exists
  const checkUsernameExists = (first_name, Last_name) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE first_name=? AND Last_name=?', [first_name, Last_name], (err, row) => {
        if (err) {
          
          reject('Error checking username existence:'+err.message); // Optionally reject with a specific error message
        }
        resolve(!!row); // Returns true if username exists
      });
    });
  };
  
  
  // Register a new user
  const registerUser = async (first_name, Last_name,password,email) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (first_name,Last_name, password,email) VALUES (?, ?,?,?)',
        [first_name,Last_name, hashedPassword,email],
        function (err) {
          if (err) reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  };
  const validateEmail=async(email)=>{
    const regrex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regrex.test(email);
  
  }
  const checkEmailExists = (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                reject('Error checking email existence: ' + err.message);
            } else {
                resolve(results.length > 0); // ✅ Correctly checks if the email exists
            }
        });
    });
};

  
  
  module.exports = {
    validateUsername,
    validatePassword,
    checkUsernameExists,
    registerUser,
    validateEmail,
    checkEmailExists
  };