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
const port = process.env.PORT || 8080; //process.env.PORT是Heroku自動動態設定

// // 連結本地端MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("連結到mongodb...");
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
// 靜態文件都會被react打包到build資料夾
app.use(express.static(path.join(__dirname, "client", "build")));

// 只有登入系統的人，才能新增或註冊課程(有jwt)
// 如果request header內部沒有jwt，則request就會被視為unauthorized
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);
// 1.Heroku網站首頁為 => URL/
// 2.NODE_ENV是Heroku自動設定的環境變數
// production/staging後面不管是什麼請求，都進入client/build/index.html = public/index.html
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// run server in port 8080，port 3000 for react
app.listen(port, () => {
  console.log("Backend server is running on port 8080...");
});
