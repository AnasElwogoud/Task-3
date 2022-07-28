const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Register
router.post("/reg", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateToken();
    await user.save();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const token = await user.generateToken();
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Get all users
router.get("/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

// Get user by ID
router.get("/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send("Unable to find user");
      }
      res.status(200).send(user);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

// Update user
router.patch("/users/:id", async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "age", "password"];
    const isValid = updates.every((el) => allowedUpdates.includes(el));
    if (!isValid) {
      return res.status(400).send("Cannot Update");
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("No User is found");
    }
    updates.forEach((el) => (user[el] = req.body[el]));
    await user.save();
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete User
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send("No user is found");
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});
module.exports = router;
