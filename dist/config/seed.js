import { connection } from '../config/database.js';
import { users } from '../data/test-data/users.js';
const User = connection.models.User;
export default async () => {
    await User.deleteMany();
    return users.forEach(user => {
        User.create(user);
    });
};
