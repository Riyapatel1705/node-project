const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/auth');

const register=(req,res)=>{
    const { username, password ,email} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const query='insert into users values(?,?,?)';
    db.query(query,[username,hashedPassword,email],(err)=>{
        if (err) {
            return res.status(500).send('Error registering user');
        }
        res.status(200).send('User registered successfully!');
    });
};

const login = (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send('Invalid username or password');
        }

        const token = generateToken(user.id);
        res.cookie('token',token,{httpOnly:true});
        res.redirect('/dashboard');
        res.status(200).send({ auth: true, token: token });
    });
};

module.exports = {
    register,
    login,
};