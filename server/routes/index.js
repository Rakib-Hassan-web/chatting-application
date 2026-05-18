const express = require("express");
// const authMiddleWare = require("../middleware/authMiddleware");
const routee = express.Router();
routee.use("/auth", require("./auth"));
routee.use("/conv", require("./conver"));
module.exports = routee;