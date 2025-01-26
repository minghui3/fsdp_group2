const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const controller = require("../controllers/testCaseController");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (!req.dest) {
            req.dest = `./uploads/${uuidv4()}` 
            if (!fs.existsSync(req.dest)) {
                fs.mkdirSync(req.dest, { recursive: true });
            }
            
        }
        cb(null, req.dest);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/add", upload.array("file", 10), controller.addTestCase);

module.exports = router;

