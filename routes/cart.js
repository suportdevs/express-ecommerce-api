const { verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken } = require('../middleware/verifyToken');
const Cart = require('../models/Cart');

const router = require('express').Router();

// Create Cart
router.post('/', verifyTokenAndAuthorization, async (req, res) => {
        const newCart = new Cart(req.body);
        try{
            const savedCart = await newCart.save();
            return res.status(200).json(savedCart);
        }catch(err){
            res.status(500).json(err);
        }
});

// Update Cart
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {new: true});
        return res.status(200).json(updatedCart);
    }catch(err){
        res.status(500).json(err);
    }
});

// Delete 
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        await Cart.findByIdAndDelete({id: req.params.id});
        res.status(200).json("Cart deleted successfull.");
    }catch(err){
        return res.status(500).json(err);
    }
});

// Find by user id
router.get('/find/:userId', verifyToken, async (req, res) => {
    try{
        const cart = await Cart.find({userId: req.params.userId});
        res.status(200).json(cart);
    }catch(err){
        return res.status(500).json(err);
    }
});

// Get all Cart or new 10
router.get('/', verifyToken, async (req, res) => {
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);
    }catch(err){
        return res.status(500).json(err);
    }
});

module.exports = router;