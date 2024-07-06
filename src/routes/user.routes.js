const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth.middleware");
const { getUserById } = require("../controllers/user.controllers");

router.get("/:id", authenticateToken, getUserById);

module.exports = router;
