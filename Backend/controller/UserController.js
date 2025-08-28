const createError = require('http-errors');
const User = require('../model/UserModel');
const { successResponse } = require('./responseController');
const mongoose = require('mongoose');
const getUsers = async(req, res, next) => {
    try {
        const search = req.query.search || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const searchRegex = new RegExp('.*' + search + ".*", 'i'); // Case-insensitive search

        const filter = {
            //role : 'user',
            $or: [
                { name: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
                { mobile: { $regex: searchRegex } }
            ]
        };

        const users = await User.find(filter,{password: 0}).limit(limit)
        .skip((page - 1) * limit);
        const count = await User.find(filter).countDocuments();
        if (!users ) throw createError(404, "No users found");

        return successResponse(res, {
            statusCode: 200,
            message: "Users fetched successfully",
        },
        payload = { 
                users,
                pagination: {
                    totalPages : Math.ceil(count / limit),
                    currentPage: page,
                    previousPage:page-1 > 0 ? page-1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
                },
            },
        );

    }catch (error) {
        next(error);
    }
};

const getUserById = async(req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) throw createError(400, "User ID is required");

        const user = await User.findById(id, {password: 0});
        if (!user ) throw createError(404, "No user found");

        return successResponse(res, {
            statusCode: 200,
            message: "Users fetched successfully",
        },
        payload = {user}
        );

    }catch (error) {
        if(error instanceof mongoose.Error){
            next(createError(400, "Invalid User ID"));
            return;
        }
        next(error);
    }
};

module.exports = { getUsers ,getUserById};