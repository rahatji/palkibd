const createError = require ('http-errors');

function notFoundHandler(req,res,next){
    next(createError(404, "route not found"));
}

function errorHandler(err, req, res, next) {
    return res.status(err.status || 500).json({
        success: false,
        message: err.message,
    });
}

module.exports = {
    notFoundHandler,
    errorHandler
};
