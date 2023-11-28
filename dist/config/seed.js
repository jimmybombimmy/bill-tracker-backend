import { connection } from '../config/database.js';
import { users } from './data/test-data/users.js';
import { transactions } from './data/test-data/transactions.js';
import { cancelledTransactions } from './data/test-data/cancelledTransactions.js';
const User = connection.models.User;
const Transaction = connection.models.Transaction;
const Cancelled_Transaction = connection.models.Cancelled_Transaction;
export default async () => {
    await User.deleteMany();
    await Transaction.deleteMany();
    await Cancelled_Transaction.deleteMany();
    await users.forEach(user => {
        User.create(user);
    });
    await transactions.forEach(transaction => {
        Transaction.create(transaction);
    });
    return cancelledTransactions.forEach(transaction => {
        Cancelled_Transaction.create(transaction);
    });
};
