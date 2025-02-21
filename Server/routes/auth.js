const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的請求!!");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("successfuly connect to auth route...");
});

router.post("/register", async (req, res) => {
  console.log("Register a user");
  // 確認註冊數據是否符合規範
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // 確認信箱是否被註冊過
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("The email has been enrolled...");
  //製作新用戶
  let { email, username, password, role } = req.body;
  let newUser = new User({ email, username, password, role });
  console.log(newUser);

  try {
    console.log("1111");
    let savedUser = await newUser.save();
    console.log("2222");

    return res.send({
      msg: "User saved successfully!!",
      savedUser,
    });
  } catch (e) {
    console.log("333");

    console.log(e);
    return res.status(500).send("Can not save the user...");
  }
});

router.post("/login", async (req, res) => {
  // 確認註冊數據是否符合規範
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // 確認信箱是否被註冊過
  const foundtUser = await User.findOne({ email: req.body.email });
  if (!foundtUser)
    return res
      .status(401)
      .send("Can not find the User. Please make sure email is exist..");

  foundtUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);
    if (isMatch) {
      // 製作json web token
      const tokenObject = { _id: foundtUser._id, email: foundtUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        msg: "Login successfully",
        token: "JWT " + token,
        user: foundtUser,
      });
    } else {
      return res.status(401).send("Password error!");
    }
  });
});

module.exports = router;
