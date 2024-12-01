const express = require("express");
const controller = require("../controllers/testResultController");

const router = express.Router();

router.post("/get-test-results", controller.getAllResults);
router.post("/add-test-results", controller.addResult);

module.exports = router;

