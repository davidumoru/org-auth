require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.routes");
const organisationRoutes = require("./routes/organisation.routes");
const db = require("./models/sequelize.models");

const app = express();

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/api/organisations", organisationRoutes);

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
