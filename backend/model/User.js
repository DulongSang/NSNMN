const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
        min: 6,
        max: 25
    },
    name: {
        type: String,
        required: true,
        max: 25
    },
    password: {
        type: String,
        required: true,
        max: 255
    },
    credit: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model("User", UserSchema);

async function hashPassword(plaintext) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plaintext, salt);
    return hashedPassword;
}

async function createUser(userInfo) {
    // check if the username is unique
    const checkUser = await getUserByUsername(userInfo.username);
    if (checkUser.err) {
        return { err };
    } else if (checkUser.docs) {
        return { err: `username ${userInfo.username} already exists` };
    }

    const hashedPassword = await hashPassword(userInfo.password);

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: userInfo.username,
        name: userInfo.username,
        password: hashedPassword
    });

    try {
        const docs = await user.save();
        return { docs };
    } catch(err) {
        return { err };
    }
}

async function getUserById(id) {
    try {
        const docs = await User.findById(id);
        return { docs };
    } catch(err) {
        return { err };
    }
}

async function getUserByUsername(username) {
    try {
        const docs = await User.findOne({ username: username });
        return { docs };
    } catch (err) {
        console.log(err);
        return { err };
    }
}

module.exports = {
    User,
    createUser,
    getUserById,
    getUserByUsername
};

