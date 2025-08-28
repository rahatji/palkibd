const successResponse = (res,{statusCode = 200,message = "Success"},payload = {} )=> {
    return res.status(statusCode).json({
        success: true,
        message: message,
        payload,
    });
};

module.exports = {successResponse};