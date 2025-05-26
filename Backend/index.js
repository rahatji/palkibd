//external imports
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require('morgan')

//internal imports
const { notFoundHandler, errorHandler } = require("../Backend/middleware/errorHandler");


app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



 //404 not found handler  
 app.use(notFoundHandler);

 //common error handler
 app.use(errorHandler)


 app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

