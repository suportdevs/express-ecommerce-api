const { verifyToken } = require('../middleware/verifyToken');
const User = require('../models/User');

const router = require('express').Router();

// Update user
router.put('/:id', verifyToken, async (req, res) => {
    if(req.user.id === req.params.id || req.user.role === 'Admin'){
        if(req.body.password){
            await bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err)res.status(401).json("Can't hash your password");
                req.body.password = hash;
            });
        }
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {new: true});
            return res.status(200).json(updatedUser);
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        return res.status(401).json("You are not alowed to perform this action!");
    }
});

// Delete 
router.delete('/:id', verifyToken, async (req, res) => {
    if(req.user.id === req.params.id || req.user.role === 'Admin'){
        try{
            await User.findByIdAndDelete({_id:req.params.id});
            res.status(200).json("User deleted successfull.");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(401).json("You are not alowed to perform this action!");
    }
});

// Find one
router.get('/find/:id', async (req, res) => {
    try{
        const data = await User.findOne({_id: req.params.id});
        const {password, ...user} = data._doc;
        res.status(200).json(user);
    }catch(err){
        return res.status(500).json("Something went wrong!");
    }
});

// Get all user or new 10
router.get('/', verifyToken, async (req, res) => {
    const query = req.query.new;
    if(req.user.role === 'Admin'){
        try{
            const users = query ? await User.find().sort({_id: -1}).limit(10) : await User.find();
            res.status(200).json(users);
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(401).json("You are not alowed to perform this action!");
    }
});

// user stats
router.get('/stats', verifyToken, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.getFullYear(date.getFullYear() - 1));
    try{
        const data = await User.aggregate([
            {$match :{
                createdAt: {$gte: lastYear}
            }},
            {$project: {
                month: {$month: "$createdAt"}
            }},
            {$group: {
                _id: "$month",
                total: {$sum: 1},
            }}
        ]);
        res.status(200).json(data);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;