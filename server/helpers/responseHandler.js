
// -------- SUCCESS RESPONSE ----------
const sendSuccess = (
  res,
  message = "Success",
  data = null,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};


// -------- ERROR RESPONSE ----------
const sendError = (
  res,
  message = "Something went wrong",
  statusCode = 500,
  error = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};