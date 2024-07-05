const jwt = require("jsonwebtoken");
const db = require("../models/sequelize.models");
const User = db.User;

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = await User.findByPk(user.userId);
    next();
  });
};

module.exports = authenticateToken;
