import { getTransactionsByIdModel } from '../models/transactions.model.js';
export const getTransactionsById = ((req, res) => {
    const user_id = req.params.user_id;
    getTransactionsByIdModel(user_id)
        .then((result) => {
        res.status(200).send(result);
    });
});
