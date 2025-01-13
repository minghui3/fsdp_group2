const User = require("../models/user");
const bcrypt = require("bcrypt");
const getUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await User.findOne(
            { email: email},
            "_id email name password photoPath dateAdded"
        );

        // no such combination
        if (result == null) {
            res.status(404).send(`Incorrect credentials`);
        }
        const isMatch = await bcrypt.compare(password, result.password)

        if (!isMatch){
            return res.status(404).send("Incorrect credentials");
        }
        const {password:_, ...userDetails} = result.toObject();
        res.status(200).json(userDetails);
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error getting user with email: ${email}`);
    } 
};

const addUser = async (req, res) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const userData = {...req.body, password: hashedPassword};
        const result = new User(userData);
        const newUser = await result.save();
        res.status(200).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error adding new user`);
    } 
};

module.exports = {
    getUser,
    addUser,
};
