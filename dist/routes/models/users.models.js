import { connection } from '../../config/database.js';
const User = connection.models.User;
export const getAllUsersModel = () => {
    return User.find();
};
