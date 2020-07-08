// router route /api/upload

const router = require("express").Router();
const multer = require("multer");

const { verifyToken } = require("../utils/jwtUtils");
const User = require("../model/User");


const avatarStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/avatars/");   // relative to server.js dir
    },
    filename: (req, file, callback) => {
        const filename = Date.now().toString(16) + ".jpg";  // random filename 
        req.filename = filename;
        callback(null, filename);
    }
})

const avatarUpload = multer({ storage: avatarStorage });
router.post("/avatar", avatarUpload.single("avatar"), async (req, res) => {
    let username;
    const token = req.get("Authorization"); // get Authorization header
    if (token) {    // if token was sent by the client
        const verification = verifyToken(token);
        if (verification.err) { // validation error
            return res.status(401).json(verification.err);
        }
        username = verification.username;
    } else {    // if authorization header was not specified
        return res.status(401).send("Unauthorized");
    }

    const user = await User.updateByUsername(username, { avatar: req.filename });
    if (user.err) {
        return res.status(500).send(user.err);
    }
    res.status(200).send(getAvatarURL(user.docs.avatar));
});

module.exports = router;