const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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

module.exports = mongoose.model("User", userSchema);