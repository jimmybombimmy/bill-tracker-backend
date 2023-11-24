import { Transaction } from '../../config/database.js';
export const getTransactionsByIdModel = (user_id) => {
    return Transaction.find({ user_id: user_id })
        .then(txns => {
        return txns;
    });
};
