const express = require("express");
const router = express.Router();
const News = require("../models/news");
const auth = require("../middelware/auth");
const multer = require("multer");

//////////////////////////// POST ////////////////////////////
router.post("/addnews", auth, async (req, res) => {
  try {
    const news = new News({ ...req.body, owner: req.user._id });
    await news.save();
    res.status(200).send(news);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

////////////////////////////// GET ///////////////////////////
router.get("/news", auth, async (req, res) => {
  try {
    const news = await News.find({});
    res.status(200).send(news);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get By Id
router.get("/news/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const news = await News.findOne({ _id, owner: req.user._id });
    if (!news) {
      return res.status(404).send("No news is found");
    }
    res.status(200).send(news);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//////////////////////////// PATCH /////////////////////////////////
router.patch("/news/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const news = await News.findOneAndUpdate(
      { _id, owner: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!news) {
      return res.status(404).send("No news is found");
    }
    res.status(200).send(news);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

////////////////////////////// DELETE //////////////////////////////////
router.delete("/news/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const news = await News.findOneAndDelete({ _id, owner: req.user._id });
    if (!news) {
      return res.status(404).send("No news is found");
    }
    res.status(200).send(news);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

///////////////////// GET USER BY NEWS ID /////////////////////////////////////////
router.get("/usernews/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const news = await News.findOne({ _id, owner: req.user._id });
    if (!news) {
      return res.status(404).send("no news is found");
    }
    await news.populate("owner");
    res.status(200).send(news.owner);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
///////////////////////////////////////////////////////////////////////

const uploads = multer({
  limits: {
    fileSize: 1000000, //1MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg|tiff)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(null, true);
  },
});
router.post("/newsImage", auth, uploads.single("image"), async (req, res) => {
  try {
    const news = new News({ ...req.body, owner: req.reporter._id });
    news.image = req.file.buffer;
    await news.save();
    res.status(200).send(news);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
module.exports = router;
