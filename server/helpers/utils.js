const jwt = require("jsonwebtoken");
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15d" },
  );
};

const verifyToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET || process.env.JWT_SEC;
    var decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    return null;
  }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };