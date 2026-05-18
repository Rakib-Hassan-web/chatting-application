const { verifyToken } = require("../helpers/utils");

const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.cookies;
    if (!token["XS_TKN"]) {
      return res.status(401).send({ error: "Invalid Request" });
    }
    const decoded = verifyToken(token["XS_TKN"]);
    if (!decoded) {
      return res.status(401).send({ error: "Invalid Request" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Invalid Request" });
  }
};

module.exports = authMiddleWare;