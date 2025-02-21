const express = require("express");
const app = express();
const portableMongo = require("portable-mongodb");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const autRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

portableMongo
  .connectToDatabase("mernDB")
  .then(() => {
    console.log("Connecting to mongodb..");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(cors());
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", autRoute);

// �u���n�J�t�Ϊ��H�A�~��s�W�ε��U�ҵ{(��jwt)
// �p�Grequest header�����S��jwt�A�hrequest�N�|�Q����unauthorized
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

// run server in port 8080�Aport 3000 for react
app.listen(8080, () => {
  console.log("Backend server is running on port 8080...");
});
