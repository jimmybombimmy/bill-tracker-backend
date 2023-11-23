import { genPassword } from '../../lib/passwordUtils.js';
import { connection } from '../../config/database.js';
import { registerUserByIdModel } from '../models/auth.model.js';
import { error409 } from '../errors.js';
const User = connection.models.User;
export const registerUserById = ((req, res) => {
    const saltHash = genPassword(req.body.password);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        hash: saltHash.hash,
        salt: saltHash.salt,
        admin: false
    });
    registerUserByIdModel(newUser, res)
        .then((result) => {
        if (result.message === 'Username already exists' || result.message === 'Email already exists') {
            return error409(res, result.message);
        }
        else {
            res.status(201).send({ message: 'Registration Successful' });
        }
    });
});
