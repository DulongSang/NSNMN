const PassportJwt = require("passport-jwt");
const JwtStrategy = PassportJwt.Strategy;
const ExtractJwt = PassportJwt.ExtractJwt;

const User = require("../model/User");
const config = require("../config.json");

module.exports = function(passport) {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.auth.secret
    };

    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        const user = await User.getUserByUsername(jwt_payload.data.username);
        if (user.err) {
            return done(err, false);
        }

        if (user.docs) {    // if user exists
            return done(null, user);
        }
        return done(null, false);   // if user does not exists
    }))
}