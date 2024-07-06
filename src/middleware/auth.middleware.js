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

    try {
      if (!user.userId) {
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      req.user = await User.findOne({ where: { userId: user.userId } });

      if (!req.user) {
        return res.sendStatus(404);
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = authenticateToken;
