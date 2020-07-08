const router = require("express").Router();

const { validateUser } = require("../utils/validation");
const User = require("../model/User");
const { generateToken, verifyToken } = require("../utils/jwtUtils");

router.post("/register", async (req, res) => {
    // user info data passed from client
    const userInfo = {
        username: req.body.username,
        password: req.body.password,
        confirm: req.body.confirm
    };

    // invalid username / password
    const err = validateUser(userInfo);
    if (err) {
        return res.status(400).send(err);
    }

    const user = await User.createUser(userInfo);

    if (user.err) {
        console.log(user.err);
        return res.status(500).send(user.err);
    }

    const username = user.docs.username;
    const token = generateToken(username, "1d");
    return res.status(201).json({ token, user: User.adaptUserInfo(user.docs) });
});

router.post("/auth", async (req, res) => {
    const token = req.get("Authorization"); // get Authorization header
    if (token) {    // if token was sent by the client
        const verification = verifyToken(token);
        if (verification.err) { // validation error
            return res.status(401).json(verification.err);
        }
        const user = await User.getUserByUsername(verification.username);
        if (user.err) {
            return res.status(500).send(user.err);
        }
        return res.status(200).json({ token, user: User.adaptUserInfo(user.docs) });
    }

    const username = req.body.username;
    const password = req.body.password;

    const validate = await User.validatePassword(username, password);
    if (validate.err) {
        return res.status(500).send(validate.err);
    }
    if (validate.result) {  // correct password
        const token = generateToken(username);
        const user = await User.getUserByUsername(username);
        if (user.err) {
            return res.status(500).send(user.err);
        }
        return res.status(200).json({ token, user: User.adaptUserInfo(user.docs) });
    }
    return res.status(401).send("Incorrect username/password");
});

router.post("/edit", async (req, res) => {
    const token = req.get("Authorization"); // get Authorization header
    const verification = verifyToken(token);
    if (verification.err) {     // validation error
        return res.status(401).json(verification.err);
    }

    const username = verification.username;
    const name = req.body.name;

    const user = await User.updateByUsername(username, { name });
    if (user.err) {
        return res.status(500).send(user.err);
    }
    res.status(200).send();
});

router.get("/:username", async (req, res) =>{
    const user = await User.getUserByUsername(req.params.username);
    if (user.err) {
        console.log(err);
        res.status(500).send(user.err);
    } else {
        if (user.docs === null) {
            return res.status(404).send("user not found");
        }
        res.status(200).json(User.adaptUserInfo(user.docs));
    }
});


module.exports = router;