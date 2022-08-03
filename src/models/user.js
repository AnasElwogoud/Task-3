const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  age: {
    type: Number,
    default: 20,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be positive number");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    validate(value) {
      let strongPassword = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
      );
      if (!strongPassword.test(value)) {
        throw new Error("Password must include !@#$%^&*");
      }
    },
  },
  phoneNum: {
    type: String,
    required: true,
    minLength: 11,
    trim: true,
    validate(value) {
      let egyNum = new RegExp(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/);
      if (!egyNum.test(value)) {
        throw new Error("Phone Number must be Egyptian No.");
      }
    },
  },
  tokens: [
    {
      type: String,
      required: true,
    },
  ],
  avatar: {
    type: Buffer,
  },
});

userSchema.virtual("news", {
  ref: "News",
  localField: "_id",
  foreignField: "owner",
});

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password"))
    user.password = await bcryptjs.hash(user.password, 8);
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Please check email or password");
  }

  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Please check email or password");
  }
  return user;
};

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "nodecourse");
  user.tokens = user.tokens.concat(token);
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
