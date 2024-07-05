const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.models")(sequelize, Sequelize);
db.Organisation = require("./organisation.models")(sequelize, Sequelize);

// Define associations
db.User.belongsToMany(db.Organisation, { through: "UserOrganisations" });
db.Organisation.belongsToMany(db.User, { through: "UserOrganisations" });

module.exports = db;
