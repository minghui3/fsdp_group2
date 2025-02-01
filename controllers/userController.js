require('dotenv').config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const getUserByEmail = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await User.findOne(
            { email: email },
            "_id email name password photoPath dateAdded"
        );

        // no such combination
        if (result == null) {
            res.status(404).send(`Incorrect credentials`);
        }

        const isMatch = await bcrypt.compare(password, result.password)

        if (!isMatch) {
            return res.status(404).send("Incorrect credentials");
        }
        const token = jwt.sign({
            id: result._id,
            email: result.email,
            name: result.name,
        }, SECRET_KEY, { expiresIn: "4h" });

        res.status(200).json({ token, userId: result._id });
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error getting user with email: ${email}`);
    }
};

const addUser = async (req, res) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const userData = { ...req.body, password: hashedPassword };
        const result = new User(userData);
        const newUser = await result.save();
        res.status(200).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error adding new user`);
    }
};
//dummy method for Authentication component to use.
const verifyUser = async (req, res) => {
    res.status(200).json({
        message: "Valid token",
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
        }
    });
}

module.exports = {
    getUserByEmail,
    addUser,
    verifyUser,
};
