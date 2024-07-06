require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const organisationRoutes = require("./routes/organisation.routes");
const db = require("./models/sequelize.models");

const app = express();

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/organisations", organisationRoutes);

const PORT = process.env.PORT || 5006;
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
    return db.sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = app;
