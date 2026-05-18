const express = require('express')
var cookieParser = require('cookie-parser')
const DB_URL = require('./dBConfig')
require('dotenv').config()
const app = express()
app.use(cookieParser())

DB_URL()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(8000, () => {
  console.log(`Example app listening on port 8000`)
})
