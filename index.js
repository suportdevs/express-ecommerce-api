const express = require('express');
const cors = require('cors');
const dotenv=require('dotenv');
const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

const dbConnection = require('./database/dbConnection');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');

dbConnection();

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/', (req, res) => {
    res.send("home page");
});

const port = process.env.PORT || 5000;
app.listen(port, (res, req) => {
    console.log(`Server is runing on port ${port}`);
})
