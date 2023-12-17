const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.get('/', (req, res) => {
    res.send("auth router");
});

// Register
router.post('/register', async (req, res) => {
    const {firstname, lastname, username, email, password} = req.body;
    try{
        await bcrypt.hash(password, 10).then(hashedPassword => {
            const user = new User({firstname, lastname, username, email, password: hashedPassword});
            user.save().then(result => {
                return res.status(201).send({
                    message: "User Created Successfully",
                    result,
                })
            })
            .catch(error => {
                return res.status(500).send({message: "Error creating user!", error})
            })
        })
        .catch(error => {
            return res.status(500).send({message: "Enable to hash password!", error});
        });
    }catch(err){
        res.status(500).send(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user)res.status(401).send({message: "Email not found!"});

        const match = await bcrypt.compare(password, user.password);
        if(!match)res.status(401).send({message: "Password does not match"});
        
        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        const token = jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: '24h'});
        res.status(200).send({message: "Login successfull.", token, ...userData});
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
})

module.exports = router;