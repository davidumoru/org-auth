const db = require("../models/sequelize.models");
const User = db.User;

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found",
        statusCode: 404,
      });
    }

    if (req.user.userId === id) {
      return res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      });
    }

    // Get the authenticated user's organisations
    const userOrganisations = await req.user.getOrganisations();
    const userOrganisationIds = userOrganisations.map((org) => org.orgId);

    // Get the target user's organisations
    const targetUserOrganisations = await user.getOrganisations();
    const targetUserOrganisationIds = targetUserOrganisations.map(
      (org) => org.orgId
    );

    // Check for common organisations
    const commonOrganisations = userOrganisationIds.filter((orgId) =>
      targetUserOrganisationIds.includes(orgId)
    );

    if (commonOrganisations.length === 0) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You do not have access to this user's information",
        statusCode: 403,
      });
    }

    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      status: "Internal Server Error",
      message: "An error occurred while processing your request",
      statusCode: 500,
    });
  }
};

module.exports = {
  getUserById,
};
