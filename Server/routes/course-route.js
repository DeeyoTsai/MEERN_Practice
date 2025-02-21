const { exec } = require("child_process");
const { route } = require("./auth");

const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("Course route is reciving a request...");
  next();
});

// ��o�t�Τ��Ҧ��ҵ{
router.get("/", async (req, res) => {
  try {
    // .populate()�bmongoDB������"instructor"��������ơA��ܦbfoundCourses
    // �ĤG�ӰѼƬ��n�㦡����Ʀ�����=>["username","email","password"]
    let foundCourses = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(foundCourses);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// �νҵ{id�M��ҵ{
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

// �s�W�ҵ{
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

// ���ҵ{
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
    // �ӽҵ{���v�~�i�H�s��ҵ{
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

// �R���ҵ{
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundCourse = await Course.findOne({ _id }).exec();
    if (!foundCourse) {
      return res.status(400).send("Find no course!!");
    }
    // �ӽҵ{���v�~�i�H�R���ҵ{
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
