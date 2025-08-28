const mongoose = require("mongoose");

const app = require('./index.js');
const dotenv = require("dotenv");


dotenv.config();

//database connection
 
 mongoose.connect(process.env.MONGO_URL)
 .then(() => console.log('MongoDB connected'))
 .catch(err => console.error('MongoDB connection error:', err));
 

 app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
