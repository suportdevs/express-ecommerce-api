const { verifyToken } = require('../middleware/verifyToken');
const User = require('../models/User');

const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('User router');
});

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
})

module.exports = router;