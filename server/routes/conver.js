const express = require("express");
const { add_Friend } = require("../controllers/conController");

const routee = express.Router();

routee.post("/addfriend" ,add_Friend)

module.exports = routee;