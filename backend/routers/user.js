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
        return res.status(201).send(err);
    }

    const user = await User.createUser(userInfo);

    if (user.err) {
        console.log(user.err);
        res.status(201).send(user.err);
    } else {
        res.status(200).send(user.docs)
    }
});

router.post("/auth", async (req, res) => {
    const token = req.get("Authorization"); // get Authorization header
    if (token) {    // if token was sent by the client
        const verification = verifyToken(token);
        if (verification.err) { // validation error
            return res.status(401).json(verification.err);
        }
        return res.status(200).json({ token, username: verification.username });
    }

    const username = req.body.username;
    const password = req.body.password;

    const validate = await User.validatePassword(username, password);
    if (validate.err) {
        return res.status(500).send(validate.err);
    }
    if (validate.result) {  // correct password
        const token = generateToken(username);
        return res.status(200).json({ token, username });
    }
    return res.status(401).send("Incorrect username/password");
});

// temp api
router.get("/:username", async (req, res) =>{
    const user = await User.getUserByUsername(req.params.username);
    if (user.err) {
        console.log(err);
        res.status(400).send(user.err);
    } else {
        if (user.docs === null) {
            return res.status(400).send("user not found");
        }
        res.status(200).send(user.docs);
    }
});


module.exports = router;