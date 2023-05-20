
// Not Found Error Handler
const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

// General Error Handler
const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    res.json({
        status: "fail",
        message: error?.message,
        stack: error?.stack,
    });
}

module.exports = { notFound, errorHandler };
