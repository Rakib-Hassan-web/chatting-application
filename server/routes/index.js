const express = require("express");
const routee = express.Router();
routee.use("/auth", require("./auth"));
routee.use("/conv", require("./conver"));
module.exports = routee;