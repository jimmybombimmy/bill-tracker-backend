import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { connection } from "./database.js";
import { validPassword } from "../utils/passwordUtils.js";
const User = connection.models.User;
const customFields = {
    usernameField: 'username',
    passwordField: 'password',
};
const verifyCallback = (username, password, done) => {
    User.findOne({ username: username })
        .then((user) => {
        if (!user) {
            return done(null, false);
        }
        const isValid = validPassword(password, user.hash, user.salt);
        if (isValid) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
        .catch((err) => {
        done(err);
    });
};
const strategy = new LocalStrategy(customFields, verifyCallback); // most basic way to create a strategy
passport.use(strategy);
passport.serializeUser((user, done) => {
    return done(null, user._id);
});
passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
        done(null, user);
    })
        .catch((err) => {
        done(err);
    });
});
