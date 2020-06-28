const jwt = require("jsonwebtoken");
const config = require("../config.json");

function generateToken(username) {
    const token = jwt.sign({ username }, config.auth.secret,
        { expiresIn: "7d" });   // token expires after 7 days
    return token;
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, config.auth.secret);
        return { username: decoded.username };
    } catch(err) {
        return { err };
    }
}

module.exports = {
    generateToken,
    verifyToken
};