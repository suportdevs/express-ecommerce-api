const { verifyTokenAndAdmin } = require('../middleware/verifyToken');
const router = require('express').Router();
const Product = require('../models/Product');

// Create Product
router.post('/', async (req, res) => {
        const newProduct = new Product(req.body);
        try{
            const savedProduct = await newProduct.save();
            return res.status(200).json(savedProduct);
        }catch(err){
            res.status(500).json(err);
        }
});
// Update Product
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {new: true});
        return res.status(200).json(updatedProduct);
    }catch(err){
        res.status(500).json(err);
    }
});

// Delete 
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product deleted successfull.");
    }catch(err){
        return res.status(500).json(err);
    }
});

// Find one
router.get('/find/:id', async (req, res) => {
    try{
        const product = await Product.findOne({_id: req.params.id});
        res.status(200).json(product);
    }catch(err){
        return res.status(500).json("Something went wrong!");
    }
});

// Get all Product or new 10
router.get('/', async (req, res) => {
    const newQuery = req.query.new;
    const categoryQuery = req.query.category;
    try{
        let products;
        if(newQuery){
            products = await Product.find().sort({createdAt: -1}).limit(5);
        }else if(categoryQuery){
            products = await Product.find({categories: {
                $in: [categoryQuery],
            }});
        }else{
            products = await Product.find();
        }
        return res.status(200).json({products});
    }catch(err){
        return res.status(500).json(err);
    }
});

module.exports = router;