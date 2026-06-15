const { sendError, sendSuccess } = require("../helpers/responseHandler");
const ConversationSchema = require("../models/ConversationSchema");
const userSchema = require("../models/userSchema");
const Message = require("../models/messageSchema");





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
    if (existingParticipent) return sendError(res, "Already in friend list", 400)

    const createNewConv = await ConversationSchema.create({
      creator: req.user._id,
      participent: friend._id,
    })

    return sendSuccess(res, "Friend added successfully", createNewConv, 201)
  } catch (error) {
      return sendError(res,"server error" ,500)  

  }
};

const getConversations = async (req, res) => {
  try {
    const convs = await ConversationSchema.find({
      $or: [{ creator: req.user._id }, { participent: req.user._id }],
    })
      .populate('creator', 'userName email')
      .populate('participent', 'userName email')
      .sort({ updatedAt: -1 })

    return sendSuccess(res, 'Conversations fetched', convs, 200)
  } catch (err) {
    return sendError(res, 'Server error', 500)
  }
}

const getMessages = async (req, res) => {
  const { id } = req.params
  try {
    const msgs = await Message.find({ conversation: id }).populate('sender', 'userName email').sort({ createdAt: 1 })
    return sendSuccess(res, 'Messages fetched', msgs, 200)
  } catch (err) {
    return sendError(res, 'Server error', 500)
  }
}

const postMessage = async (req, res) => {
  const { conversation, content } = req.body
  if (!conversation || !content) return sendError(res, 'conversation and content required', 400)
  try {
    const msg = await Message.create({ content, sender: req.user._id, conversation })
    return sendSuccess(res, 'Message created', msg, 201)
  } catch (err) {
    return sendError(res, 'Server error', 500)
  }
}

module.exports = { add_Friend, getConversations, getMessages, postMessage };
