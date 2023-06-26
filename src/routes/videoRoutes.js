// videoRoutes.js

const express = require("express");
const multer = require('multer');
const videoController = require("../controllers/videoController");

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), videoController.uploadVideo);
router.get("/feeds", videoController.getVideoFeeds);

module.exports = router;
