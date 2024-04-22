import passport from 'passport';
import { genPassword } from '../../utils/passwordUtils.js';
import { connection } from '../../config/database.js';
import { forgotPasswordModel, registerUserModel } from '../models/auth.model.js';
import { error401, error409 } from '../errors.js';
const User = connection.models.User;
export const registerUser = ((req, res) => {
    const saltHash = genPassword(req.body.password);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        hash: saltHash.hash,
        salt: saltHash.salt,
        admin: false
    });
    registerUserModel(newUser, res)
        .then((result) => {
        if (result.message === 'Username already exists' || result.message === 'Email already exists') {
            return error409(res, result.message);
        }
        else {
            res.status(201).send({ message: 'Registration Successful' });
        }
    });
});
export const loginUser = (async (req, res, next) => {
    await passport.authenticate('local', (err, user) => {
        if (!user) {
            return error401(res, 'userNotMatched');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/api/login-success');
        });
    })(req, res, next);
});
export const loginSuccess = ((req, res, next) => {
    res.status(201).send({
        message: "Login successful",
    });
});
export const logoutUser = (async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        // res.redirect('/protected-route');
        res.status(201).send({
            message: "Logout successful",
        });
    });
});
export const forgotPassword = ((req, res, next) => {
    const userEmail = req.body.email;
    const resetUrl = `${req.protocol}://${req.get('host')}/api/reset-password`;
    forgotPasswordModel(userEmail, resetUrl)
        .then(() => {
        res.status(201).send({
            message: "Password reset email sent successfully"
        });
    });
});
export const passwordReset = ((req, res, next) => {
});
