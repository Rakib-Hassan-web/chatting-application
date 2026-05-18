const express = require("express");

const { Registration, Login } = require("../controllers/authcontroller");

const routee = express.Router();

routee.post("/register" , Registration)
routee.post("/login" , Login)


module.exports = routee;