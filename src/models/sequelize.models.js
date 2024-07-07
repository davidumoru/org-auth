const { Sequelize } = require("sequelize");
const pg = require("pg");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectModule: pg,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      timestamps: true,
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.models")(sequelize, Sequelize);
db.Organisation = require("./organisation.models")(sequelize, Sequelize);

// Define associations
db.User.belongsToMany(db.Organisation, {
  through: "UserOrganisations",
  foreignKey: "userId",
  otherKey: "orgId",
});
db.Organisation.belongsToMany(db.User, {
  through: "UserOrganisations",
  foreignKey: "orgId",
  otherKey: "userId",
});

module.exports = db;
