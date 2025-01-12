const express = require("express");
const multer = require("multer");
const controller = require("../controllers/testCaseController");

const router = express.Router();
const upload = multer({ dest: '/uploads' });

router.post("/add", upload.array("file", 10), controller.addTestCase);

module.exports = router;

