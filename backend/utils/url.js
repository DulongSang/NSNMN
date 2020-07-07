const config = require("../config.json");

function getAvatarURL(filename) {
    return config.main.url + "/src/avatars/" + filename;
}

module.exports = {
    getAvatarURL
};