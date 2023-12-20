const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader)res.status(401).json("You are not authenticated!");
        const token = authHeader.split(" ")[1];
        
        if(!token) res.status(401).json("You are not authenticated!");
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) return res.status(401).json("Token is not valid!");
            req.user = user;
            next();
        });
    }catch(err){
        return res.status(500).json(err);
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.role === 'Admin'){
            next();
        }else{
            return res.status(401).json("You are not alowed to perform this action!");
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.role === 'Admin'){
            next();
        }else{
            return res.status(401).json("You are not alowed to perform this action!");
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};