import { User } from '../../config/database.js';
import { generateRandomHash, getPasswordResetToken } from '../../utils/otherCryptoUtils.js';
import { sendPasswordResetEmail } from '../../utils/email.js';
export const registerUserModel = (async (newUser, res) => {
    const existingUser = await User.findOne({
        $or: [
            { username: newUser.username },
            { email: newUser.email }
        ]
    });
    if (existingUser) {
        if (existingUser.username === newUser.username) {
            return { message: "Username already exists" };
        }
        if (existingUser.email === newUser.email) {
            return { message: "Email already exists" };
        }
    }
    return newUser.save(newUser)
        .then((user) => {
        return user;
    });
});
export const forgotPasswordModel = (async (userEmail, resetUrl, next) => {
    const existingUser = await User.findOne({
        email: userEmail
    });
    if (!existingUser) {
        return next();
    }
    const resetToken = generateRandomHash();
    const passwordResetToken = getPasswordResetToken(resetToken);
    return User.updateOne({ username: existingUser.username }, { $set: { passwordReset: passwordResetToken } })
        .then(({ acknowledged, modifiedCount }) => {
        if (acknowledged && modifiedCount > 0) {
            return sendPasswordResetEmail(resetToken, userEmail, resetUrl);
        }
    });
});
export const passwordResetModel = (async (token, newPassword) => {
    const matchingToken = getPasswordResetToken(token);
    const existingUser = await User.findOne({ 'passwordReset.passwordResetToken': matchingToken.passwordResetToken });
    if (existingUser == null) {
        //update this with unsuccessful connection tests
        console.log("Couldn't find user");
        return;
    }
    return User.updateOne({ username: existingUser.username }, { $set: newPassword })
        .then((result) => {
        return result;
    });
});
