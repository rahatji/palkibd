//external imports
const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan')


//internal imports
const { notFoundHandler, errorHandler } = require("../Backend/middleware/errorHandler");
const seedRouter = require("./Routes/seedRouter");
const userRouter = require("./Routes/userRouter");
const authRouter = require("./Routes/authRouter");



dotenv.config();
const app = express();

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/api/seed', seedRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);


 //404 not found handler  
 app.use(notFoundHandler);

 //common error handler
 app.use(errorHandler)




module.exports = app; 
