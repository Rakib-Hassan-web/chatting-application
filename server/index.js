const express = require('express')
var cookieParser = require('cookie-parser')
const DB_URL = require('./dBConfig')
const routee = require('./routes')
require('dotenv').config()

const app = express()

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