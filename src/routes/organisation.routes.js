const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth.middleware");
const {
  getOrganisations,
  getOrganisationById,
  createOrganisation,
  addUserToOrganisation,
} = require("../controllers/organisation.controllers");

router.get("/", authenticateToken, getOrganisations);
router.get("/:orgId", isAuthenticated, getOrganisationById);
router.post("/", authenticateToken, createOrganisation);
router.post("/:orgId/users", authenticateToken, addUserToOrganisation);

module.exports = router;
