const router = require("express").Router();
const bcrypt = require("bcryptjs");

const { validateUser } = require("../utils/validation");
const User = require("../model/User");


async function hashPassword(plaintext) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plaintext, salt);
    
    return hashedPassword;
}


router.post("/register", async (req, res) => {
    const newUser = {
        username: req.body.username,
        password: req.body.password,
        confirm: req.body.confirm
    };

    // invalid username / password
    const err = validateUser(newUser);
    if (err) {
        return res.status(201).send(err);
    }

    newUser.password = await hashPassword(newUser.password);

    const user = new User({
        username: newUser.username,
        name: newUser.username,
        password: newUser.password
    });

    // try to save to new user to db
    try {
        const savedUser = await user.save();
        res.status(200).send(savedUser);
    } catch(err) {
        res.status(201).send(err);
    }
});


module.exports = router;