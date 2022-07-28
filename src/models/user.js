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
    validate(agevalue) {
      if (agevalue < 0) {
        throw new Error("Age must be Postive number");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    validate(psw) {
      let strongPass = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#/$%/^&/*])"
      );
      if (!strongPass.test(psw)) {
        throw new Error("Password must include Spcial Characters");
      }
    },
  },
});
userSchema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcryptjs.hash(this.password, 8);
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Please CHECK your Email or Password");
  }
  const isMatched = await bcryptjs.compare(password, user.password);
  if (!isMatched) {
    throw new Error("Please CHECK your Email or Password");
  }
  return user;
};

userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id.toString() }, "userToken");
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
