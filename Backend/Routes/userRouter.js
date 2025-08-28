const express = require('express');

const {getUsers,getUserById} = require('../controller/UserController');

const userRouter = express.Router();
// Route to get all users
userRouter.get('/', getUsers);
// Route to get a specific user by ID
userRouter.get('/:id', getUserById);

module.exports = userRouter;