const db = require('../config/db');

const User = {
    createUser: (userData, callback) => {
        const query = 'INSERT INTO users (user_name, password, email) VALUES (?, ?, ?)';
        db.query(query, [userData.user_name, userData.password, userData.email], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    },
    findUserByEmail: (email, callback) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results[0]); // Return the first user found
        });
    }
};

module.exports = User;
