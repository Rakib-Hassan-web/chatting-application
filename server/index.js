const express = require('express')
var cookieParser = require('cookie-parser')
const cors = require('cors')
const DB_URL = require('./dBConfig')
const routee = require('./routes')
require('dotenv').config()

const app = express()

// enable CORS for the client with credentials (cookies)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3001'
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
)

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

app.listen(8000, () => {
  console.log(`Example app listening on port 8000`)
})