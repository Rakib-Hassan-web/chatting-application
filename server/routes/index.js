const express = require("express");
const routee = express.Router();
routee.use("/auth", require("./auth"));
routee.use("/conv", require("./conver"));
routee.use('/users', require('./users'))
module.exports = routee;