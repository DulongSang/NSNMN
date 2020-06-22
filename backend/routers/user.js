const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');

const { validateUser } = require("../utils/validation");
const User = require("../model/User");


async function hashPassword(plaintext) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plaintext, salt);
    return hashedPassword;
}

router.post("/register", async (req, res) => {
    // user info data passed from client
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

    // user used User model
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: newUser.username,
        name: newUser.username,
        password: newUser.password
    });

    // try to save to new user to db
    try {
        // newUser.save().then(result => {
        //     console.log(result);
        // })
        //     .catch(err => console.log(err));

        const savedUser = await user.save();
        res.status(200).send(savedUser);

    } catch(err) {
        res.status(201).send(err);
    }
});

router.get("/:userId",(req,res,next) =>{
    const id = req.params._id;
    User.findById(id)
        .exec()
        .then(doc => {
            console.log("from database: " + doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});

        });
});


module.exports = router;