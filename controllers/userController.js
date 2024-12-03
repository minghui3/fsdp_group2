const User = require("../models/user");

const getUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await User.findOne(
            { email: email, password: password },
            "_id email name photoPath dateAdded"
        );

        // no such combination
        if (result == null) {
            res.status(404).send(`Incorrect credentials`);
        } else {
            res.status(200).json(result);
        }
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error getting user with email: ${email}`);
    } 
};

const addUser = async (req, res) => {
    try {
        const result = new User(req.body);
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
