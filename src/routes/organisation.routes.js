const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth.middleware");
const {
  getOrganisations,
  createOrganisation,
  addUserToOrganisation,
} = require("../controllers/organisationController");

router.get("/", authenticateToken, getOrganisations);
router.post("/", authenticateToken, createOrganisation);
router.post("/:orgId/users", authenticateToken, addUserToOrganisation);

module.exports = router;
