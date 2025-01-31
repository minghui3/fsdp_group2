const express = require("express");
const controller = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

router.post("/login", controller.getUserByEmail);
router.post("/add-user", controller.addUser);
router.get("/verify-user", authenticateToken, controller.verifyUser);

module.exports = router;
