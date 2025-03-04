const db = require('../config/db');

const dashboard=(req,res)=>{
    res.render('dashboard', { userId: req.userId });
};

module.exports={
    dashboard,
};
