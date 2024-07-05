const { v4: uuidv4 } = require("uuid");
const db = require("../models/sequelize.models");
const Organisation = db.Organisation;
const User = db.User;

const getOrganisations = async (req, res) => {
  try {
    const organisations = await req.user.getOrganisations();
    res.status(200).json({
      status: "success",
      message: "Organisations retrieved successfully",
      data: {
        organisations,
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

const getOrganisationById = async (req, res) => {
  const { orgId } = req.params;

  try {
    const organisation = await Organisation.findByPk(orgId);

    if (!organisation) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organisation not found",
        statusCode: 404,
      });
    }

    const userOrganisations = await req.user.getOrganisations({
      where: { orgId },
    });

    if (!userOrganisations.length) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You do not have access to this organisation",
        statusCode: 403,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Organisation retrieved successfully",
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
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

const createOrganisation = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(422).json({
      errors: [{ field: "name", message: "Name is required" }],
    });
  }

  try {
    const organisation = await Organisation.create({
      orgId: uuidv4(),
      name,
      description,
    });

    await req.user.addOrganisation(organisation);

    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
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

const addUserToOrganisation = async (req, res) => {
  const { userId } = req.body;
  const { orgId } = req.params;

  try {
    const organisation = await Organisation.findByPk(orgId);
    const user = await User.findByPk(userId);

    if (!organisation || !user) {
      return res.status(400).json({
        status: "Bad request",
        message: "Organisation or User not found",
        statusCode: 400,
      });
    }

    await organisation.addUser(user);

    res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
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
  getOrganisations,
  getOrganisationById,
  createOrganisation,
  addUserToOrganisation,
};
