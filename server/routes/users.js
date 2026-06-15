const express = require('express')
const userSchema = require('../models/userSchema')
const auth = require('../middleware/authMiddleware')
const { sendSuccess, sendError } = require('../helpers/responseHandler')

const routee = express.Router()

routee.get('/', auth, async (req, res) => {
  try {
    const users = await userSchema.find({}, 'userName email avatar')
    return sendSuccess(res, 'Users fetched', users, 200)
  } catch (err) {
    return sendError(res, 'Server error', 500)
  }
})

module.exports = routee
