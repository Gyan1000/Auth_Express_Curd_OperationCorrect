const CustomError_middleware = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "SOME ERROR OCCUR ";

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};

export default CustomError_middleware;
