const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try{
        const authHeader = req.headers.token;
        if(!authHeader)res.status(401).json("You are not authenticated!");
        const token = authHeader.split(" ")[1];
        if(!token)res.status(401).json("You are not authenticated!");
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err)res.status(401).json("Token is not valid!");
            req.user = user;
            next();
        });
    }catch(err){
        return res.status(500).json(err);
    }
}

module.exports = {verifyToken};