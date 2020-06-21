// returns error info if thers is an error, null otherwise
function validateUser(user) {
    // validate username
    if (user.username.length < 6) {
        return "Username should contain at least 6 characters";
    }
    if (user.username.length > 25) {
        return "Username should contain at most 25 characters";
    }
    if (!user.username.match(/^[A-Za-z0-9]+$/)) {
        return "Username should contain only letters & numbers";
    }
    
    // validate password
    if (user.password.length < 6) {
        return "Password should contain at least 6 characters";
    }

    if (user.password !== user.confirm) {
        return "Those passwords didn't match";
    }

    return null;
}

module.exports = {
    validateUser
};