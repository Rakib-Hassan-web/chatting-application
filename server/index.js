const express = require('express')
var cookieParser = require('cookie-parser')
require('dotenv').config()
const app = express()
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(8000, () => {
  console.log(`Example app listening on port 8000`)
})
