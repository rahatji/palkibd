const express = require('express');
const seedRouter = express.Router();
const { seedUser } = require('../controller/seedController');

seedRouter.get('/users', seedUser);

module.exports = seedRouter;