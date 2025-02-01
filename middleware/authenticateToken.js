require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const SECRET_KEY = process.env.SECRET_KEY;
const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1].replace(/"/g, "");
    if (!token) {
        res.status(401).json({ message: "Invalid token: No token found" });
        return;
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401).json({ message: "No user found with this token" });
            return;
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error verifying token", error);
        res.status(401).json({ message: "Invalid token: Unknown error or token expired" });
    }
}
module.exports = authenticateToken;
