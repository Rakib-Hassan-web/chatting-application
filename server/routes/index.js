const express = require("express");
// const authMiddleWare = require("../middleware/authMiddleware");
const route = express.Router();
route.use("/auth", require("./auth"));
route.use("/conv", require("./conver"));
module.exports = route;