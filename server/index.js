const express = require('express')
var cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const DB_URL = require('./dBConfig')
const routee = require('./routes')
const { verifyToken } = require('./helpers/utils')
const Message = require('./models/messageSchema')
require('dotenv').config()

const app = express()

// enable CORS for the client with credentials (cookies)
// Supports a comma-separated list in CLIENT_ORIGINS or falls back to reflecting
// the request origin in development (useful when Vite picks different ports).
const CLIENT_ORIGINS = process.env.CLIENT_ORIGINS
  ? process.env.CLIENT_ORIGINS.split(',').map((s) => s.trim())
  : null

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    // allow non-browser requests like curl or server-to-server
    if (!origin) return callback(null, true)
    if (CLIENT_ORIGINS) {
      if (CLIENT_ORIGINS.includes(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    }
    // no specific list provided — allow and reflect the request origin
    return callback(null, true)
  },
}

app.use(cors(corsOptions))

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// routes
app.use(routee)

DB_URL()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// create HTTP server and attach Socket.IO
const server = http.createServer(app)

// default allowed origins for socket (include common dev ports)
const defaultSocketOrigins = ['http://localhost:3000', 'http://localhost:3001']
const socketOrigins = CLIENT_ORIGINS || defaultSocketOrigins

const io = new Server(server, {
  cors: {
    origin: socketOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

io.on('connection', (socket) => {
  console.log('socket connected', socket.id)

  // identify user from socket auth token (preferred), query, or cookies
  const getSocketUser = () => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token
      if (token) return verifyToken(token)

      const cookies = socket.handshake.headers.cookie || ''
      const parsed = cookies
        .split(';')
        .map((s) => s.trim())
        .reduce((acc, p) => {
          const [k, v] = p.split('=')
          if (k && v) acc[k] = v
          return acc
        }, {})
      const xs = parsed['XS_TKN']
      if (xs) return verifyToken(xs)
      return null
    } catch (err) {
      return null
    }
  }

  socket.on('join', ({ room }) => {
    if (room) socket.join(room)
  })

  socket.on('leave', ({ room }) => {
    if (room) socket.leave(room)
  })

  socket.on('message', async (msg) => {
    try {
      const decoded = getSocketUser()
      const senderId = decoded?._id
      const senderName = decoded?.userName || decoded?.email || msg.sender || 'Anonymous'

      const room = msg.conversation || 'global'
      const outMsg = { ...msg, sender: senderName, senderId }

      io.to(room).emit('message', outMsg)

      // persist message when possible
      if (senderId && msg.conversation && (msg.text || msg.content)) {
        await Message.create({ content: msg.text || msg.content, sender: senderId, conversation: msg.conversation })
      }
    } catch (err) {
      console.error('socket message error', err)
    }
  })
})

server.listen(8000, () => {
  console.log(`Example app listening on port 8000`)
})