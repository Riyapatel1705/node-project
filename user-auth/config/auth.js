const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const generateToken=(userId)=>{
    return jwt.sign({id:userId},secret,{expiresIn:'24h'});
};

const verifyToken=(req,res,next)=>{
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token=bearerToken;
        jwt.verify(req.token,secret,(err,decoded)=>{
            if(err){
                return res.status(403).send('Failed to authenticate token');
            }
            req.userId=decoded.id;
            next();
        });

    }else {
        res.sendStatus(403);
    }
}
module.exports = {
    generateToken,
    verifyToken,
};