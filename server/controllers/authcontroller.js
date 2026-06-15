const { sendError, sendSuccess } = require("../helpers/responseHandler");
const { generateAccessToken, generateRefreshToken } = require("../helpers/utils");
const userSchema = require("../models/userSchema");


const Registration = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    if (!userName) return sendError(res,"userName is required" ,400)
    if (!email) return sendError(res,"email is required" ,400)
    if (!password)   return sendError(res,"password is required" ,400)

    const existEmail = await userSchema.findOne({ email });
    if (existEmail) return sendError(res, "User already exists", 400)

    const user = await userSchema.create({
      userName,
      email,
      password,
    })

    return sendSuccess(res, "Registration successful", { user: { _id: user._id, email: user.email, userName: user.userName } }, 201)
  } catch (error) {
    console.log(error);
     sendError(res,"Internal Server Error" ,500)
  }
};

const cookie_config = {
  httpOnly: false, 
  secure: false,
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await userSchema.findOne({ email }).select("+password");

    if (!userData) return  sendError(res,"Invalid crediential" ,400)  
    if (userData.isVerified === false)  return  sendError(res,"Email is not verified" ,400)
 

    const matchPassword = await userData.comparePassword(password)
    if (!matchPassword) return sendError(res, 'Invalid credential', 400)

    const accToken = generateAccessToken(userData)
    const refToken = generateRefreshToken(userData)

    res.cookie('XS_TKN', accToken, cookie_config).cookie('RF_TKN', refToken, cookie_config)
    return sendSuccess(
      res,
      'Login successful',
      { user: { _id: userData._id, email: userData.email, userName: userData.userName }, accessToken: accToken },
      200,
    )
  } catch (error) {
  
     sendError(res,"Internal Server Error" ,500)
  }
};

module.exports = { Registration, Login }