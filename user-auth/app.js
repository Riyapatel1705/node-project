const express=require('express');

const bodyParser = require('body-parser');
const path = require('path');
const {verifyToken}=require('./config/auth');
const { register, login } = require('./controllers/authController');
const { dashboard } = require('./controllers/userController');

require('dotenv').config

const app=express();
const port=3000;

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.set('view-engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/register',(req,res)=>{
    res.render('register');
});

app.post('/register',register);

//user login
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', login);

//protected Route//
app.get('/dashboard', verifyToken, dashboard);
//logout route
app.get('/logout', (req, res) => {
    // Here you can handle the logout process (e.g., destroy the session or token)
    res.redirect('/login'); // Redirect to login page after logout
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


