const express = require("express");
const controller = require("../controllers/userController");

const router = express.Router();

router.post("/login", controller.getUser);
// router.post("/addUser", controller.addUser);

module.exports = router;
