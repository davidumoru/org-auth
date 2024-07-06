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

    if (req.user.id === id) {
      return res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      });
    }

    // Check if the user is in the same organisation
    const userOrganisations = await req.user.getOrganisations();
    const targetUserOrganisations = await user.getOrganisations();

    const commonOrganisations = userOrganisations.filter((org) =>
      targetUserOrganisations.some((targetOrg) => targetOrg.id === org.id)
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
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Client error",
      statusCode: 400,
    });
  }
};
module.exports = {
  getUserById,
};
