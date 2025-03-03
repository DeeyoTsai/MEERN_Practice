// ./models/user-model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcyrptjs = require("bcryptjs");
// const { required } = require("joi");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// instance methods
userSchema.methods.isStudent = function () {
  return this.role == "student";
};

userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};

userSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    result = await bcyrptjs.compare(password, this.password);
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

// mongoose middleware
// �Y���s�Τ�or���b���K�X�A�h�N�K�X�i������B�z
userSchema.pre("save", async function (next) {
  // this�N��mongoDB����document
  if (this.isNew || this.isModified("password")) {
    const hashValue = await bcyrptjs.hash(this.password, 10);
    this.password = hashValue;
  }

  next();
});

module.exports = mongoose.model("User", userSchema);
