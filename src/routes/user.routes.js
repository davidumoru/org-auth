const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/user.controllers");

router.get("/:id", getUserById);

module.exports = router;
