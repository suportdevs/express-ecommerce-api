const express = require('express');
const cors = require('cors');
const dotenv=require('dotenv');
const app = express();
dotenv.config();

app.use(cors());

const dbConnection = require('./database/dbConnection');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

dbConnection();

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/', (req, res) => {
    res.send("home page");
});

const port = process.env.PORT || 5000;
app.listen(port, (res, req) => {
    console.log(`Server is runing on port ${port}`);
})