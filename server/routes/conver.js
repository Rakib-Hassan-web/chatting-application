const express = require('express')
const { add_Friend, getConversations, getMessages, postMessage } = require('../controllers/conController')
const auth = require('../middleware/authMiddleware')

const routee = express.Router()

routee.post('/addfriend', auth, add_Friend)
routee.get('/list', auth, getConversations)
routee.get('/:id/messages', auth, getMessages)
routee.post('/message', auth, postMessage)

module.exports = routee