import { User } from '../../config/database.js';
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
