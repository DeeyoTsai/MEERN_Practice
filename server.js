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
const path = require("path");
const port = process.env.PORT || 8080; //process.env.PORT�OHeroku�۰ʰʺA�]�w

// // �s�����a��MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("�s����mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

// portableMongo
//   .connectToDatabase("mernDB")
//   .then(() => {
//     console.log("Connecting to mongodb..");
//   })
//   .catch((e) => {
//     console.log(e);
//   });

app.use(cors());
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", autRoute);
// �R�A��󳣷|�Qreact���]��build��Ƨ�
app.use(express.static(path.join(__dirname, "client", "build")));

// �u���n�J�t�Ϊ��H�A�~��s�W�ε��U�ҵ{(��jwt)
// �p�Grequest header�����S��jwt�A�hrequest�N�|�Q����unauthorized
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);
// 1.Heroku���������� => URL/
// 2.NODE_ENV�OHeroku�۰ʳ]�w�������ܼ�
// production/staging�᭱���ެO����ШD�A���i�Jclient/build/index.html = public/index.html
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// run server in port 8080�Aport 3000 for react
app.listen(port, () => {
  console.log("Backend server is running on port 8080...");
});
