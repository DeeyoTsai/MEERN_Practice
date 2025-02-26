const { exec } = require("child_process");
const { route } = require("./auth");
const { course } = require("../models");
const { log } = require("console");

const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("Course route is reciving a request...");
  next();
});

// 獲得系統中所有課程
router.get("/", async (req, res) => {
  try {
    // .populate()在mongoDB中找到跟"instructor"有關的資料，顯示在foundCourses
    // 第二個參數為要顯示的資料有哪些=>["username","email","password"]
    let foundCourses = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(foundCourses);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用課程名稱尋找課程
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let courseFound = await Course.find({ title: name })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用課程id尋找課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundCourse = await Course.findOne({ _id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(foundCourse);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用講師id來尋找課程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  let courseFound = await Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(courseFound); //09:04
});

// 用學生id尋找註冊的課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let courseFound = await Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(courseFound);
});

// 新增課程
router.post("/", async (req, res) => {
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user.isStudent()) {
    return res
      .status(400)
      .send(
        "Only instructor can publish a new class. IF you are an instructor, please login with your instructor account"
      );
  }
  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });

    let savedCourse = await newCourse.save();
    return res.send({
      message: "A new course has been saved",
      savedCourse,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Can not publish a class");
  }
});

// 學生透過課程id註冊課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundCourse = await Course.findOne({ _id }).exec();
    // 從jwt取得uesr_id
    foundCourse.students.push(req.user._id);
    await foundCourse.save();
    return res.send("註冊完成");
  } catch (e) {
    console.log(e);
  }
});

// 更改課程
router.patch("/:_id", async (req, res) => {
  let { error } = courseValidation(req.body);
  if (error) return res.status(500).send(error.details[0].message);

  let { _id } = req.params;
  try {
    let foundCourse = await Course.findOne({ _id });
    console.log(foundCourse);

    if (!foundCourse) {
      return res.status(400).send("Find no course!!");
    }
    // 該課程講師才可以編輯課程
    if (foundCourse.instructor.equals(req.user._id)) {
      let updateCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        message: "Update course successfully",
        updateCourse,
      });
    } else {
      return res
        .status(403)
        .send("Only this course's instructor can edit the class.");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 刪除課程
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundCourse = await Course.findOne({ _id }).exec();
    if (!foundCourse) {
      return res.status(400).send("Find no course!!");
    }
    // 該課程講師才可以刪除課程
    if (foundCourse.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("The course has been deleted!!");
    } else {
      return res
        .status(403)
        .send("Only this course's instructor can delete the class.");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
