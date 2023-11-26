import { getTransactionsByIdModel, postTransactionModel } from '../models/transactions.model.js';
import { sessionInfo } from '../../app.js';
import { error400, error401 } from '../errors.js';
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
export const postTransaction = ((req, res) => {
    const txnDetails = req.body;
    const created_at = Date.now();
    const user_id = sessionInfo.passport.user;
    if (!user_id) {
        return error401(res, 'userNotAuthed');
    }
    const txnInfo = {
        user_id,
        name: txnDetails.name,
        type: txnDetails.type,
        frequency: txnDetails.frequency,
        created_at,
        amount: txnDetails.amount,
        history: []
    };
    const txnValidCheck = (txn) => {
        if (txn.name) {
            return true;
        }
        else {
            return false;
        }
    };
    if (txnValidCheck(txnInfo) === false) {
        return error400(res, 'txnInfoMissing');
    }
    else {
        postTransactionModel(txnInfo)
            .then((result) => {
            res.status(201).send(result);
        });
    }
});
export const patchTransaction = ((req, res) => {
});
