const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middelware/auth");
const multer = require("multer");

router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateToken();
    await user.save();
    res.status(201).send({ user });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/////////////////////////////////////////////////////////
router.get("/profile", auth, async (req, res) => {
  res.status(200).send(req.user);
});

///////////////////////////////////////////////////////////////////
router.patch("/editprofile", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "age", "password", "phoneNum"];
    const isValid = updates.every((el) => allowedUpdates.includes(el));
    if (!isValid) {
      return res.status(400).send("Can't update");
    }
    updates.forEach((el) => (req.user[el] = req.body[el]));
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

/////////////////////////////////////////////////////////////////////////
router.delete("/user", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

///////////////////////////////////////////////////////////////////////
router.delete("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((el) => {
      return el !== req.token;
    });
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

//////////////////////////////////////////////////////////////////////
const uploads = multer({
  limits: {
    fileSize: 1000000, //1MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(null, true);
  },
});
router.post(
  "/profileimage",
  auth,
  uploads.single("avatar"),
  async (req, res) => {
    try {
      req.user.avatar = req.file.buffer;
      await req.user.save();
      res.send(req.user);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

module.exports = router;
