const express = require("express");
const multer = require("multer");
const fs = require("fs");
const controller = require("../controllers/testCaseController");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (!fs.existsSync("./uploads")) {
            fs.mkdirSync("./uploads");
        }
        cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/add", upload.array("file", 10), controller.addTestCase);

module.exports = router;

