const { sendError, sendSuccess } = require("../helpers/responseHandler");
const ConversationSchema = require("../models/ConversationSchema");
const userSchema = require("../models/userSchema");



const add_Friend = async (req, res) => {
  const { email } = req.body;
  try {
    if (email === req.user.email) {
      return sendError(res,"Try with another email" ,400)     
    }
    const friend = await userSchema.findOne({ email });
    if (!friend)
      return sendError(res,"This email dose not exist" ,400)      
    const existingParticipent = await ConversationSchema.findOne({
      $or: [
        { creator: req.user._id, participent: friend._id },
        { participent: req.user._id, creator: friend._id },
      ],
    });
    if (existingParticipent)
      return sendError(res,"Already in friend list" ,400)  
    const createNewConv = await conversationSchema.create({
      creator: req.user._id,
      participent: friend._id,
    });

    sendSuccess(res,"Friend Added successfylly" ,200)  
  } catch (error) {
      return sendError(res,"server error" ,500)  

  }
};

module.exports = { add_Friend };