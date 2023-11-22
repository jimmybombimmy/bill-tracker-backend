import { connection } from '../../config/database.js';
const User = connection.models.User;
export const getAllUsersModel = () => {
    return User.find();
};
export const getUserByIdModel = (user_id, res) => {
    return User.find({ _id: user_id })
        .then(user => {
        return user[0];
    });
};
