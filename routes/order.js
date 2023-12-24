const { verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken } = require('../middleware/verifyToken');
const Order = require('../models/Order');

const router = require('express').Router();

// Create Order
router.post('/', verifyTokenAndAuthorization, async (req, res) => {
        const newOrder = new Order(req.body);
        try{
            const savedOrder = await newOrder.save();
            return res.status(200).json(savedOrder);
        }catch(err){
            res.status(500).json(err);
        }
});

// Update Order
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {new: true});
        return res.status(200).json(updatedOrder);
    }catch(err){
        res.status(500).json(err);
    }
});

// Delete 
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        await Order.findByIdAndDelete({id: req.params.id});
        res.status(200).json("Order deleted successfull.");
    }catch(err){
        return res.status(500).json(err);
    }
});

// Find by user id
router.get('/find/:userId', verifyToken, async (req, res) => {
    try{
        const order = await Order.find({userId: req.params.userId});
        res.status(200).json(order);
    }catch(err){
        return res.status(500).json(err);
    }
});

// Get all Orders
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try{
        const orders = await Order.find();
        return res.status(200).json(orders);
    }catch(err){
        return res.status(500).json(err);
    }
});

// Get income stats
router.get('/income', verifyToken, async (req, res) => {
    try{
        const productId = req.params.pid;
         const currentDate = new Date();
         const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() -1));
        //  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1));

        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: lastMonth
                    },
                    ...(productId && {
                        products: {$elemMatch: {productId}}
                    })
                }
            },
            {
                $project: {
                    month: {$month: "$createdAt"},
                    sales: "$amount",
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: "$sales"},
                }
            }
        ]);
        return res.status(200).json(income);
    }catch(err){
        return res.status(500).json(err);
    }
});

module.exports = router;