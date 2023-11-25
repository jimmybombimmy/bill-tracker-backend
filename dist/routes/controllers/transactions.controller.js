import { getTransactionsByIdModel } from '../models/transactions.model.js';
import { sessionInfo } from '../../app.js';
import { error401 } from '../errors.js';
export const getTransactionsById = ((req, res) => {
    const user_id = req.params.user_id;
    if (sessionInfo.passport.user !== user_id) {
        return error401(res, 'userNotAuthed');
    }
    getTransactionsByIdModel(user_id)
        .then((result) => {
        res.status(200).send(result);
    });
});
