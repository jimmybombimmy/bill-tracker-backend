import { deleteTransactionModel, getTransactionsByIdModel, getSoleTransactionByIdModel, getTransactionsHistoryByIdModel, patchTransactionModel, postTransactionModel } from '../models/transactions.model.js';
import { sessionInfo } from '../../app.js';
import { error400, error401, error404 } from '../errors.js';
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
export const getSoleTransactionById = ((req, res) => {
    const { user_id, txn_id } = req.params;
    getSoleTransactionByIdModel(user_id, txn_id)
        .then((result) => {
        if (!result) {
            return error401(res, 'userNotAuthed');
        }
        res.status(200).send(result);
    });
});
export const getTransactionsHistoryById = ((req, res) => {
    const user_id = req.params.user_id;
    if (sessionInfo.passport.user !== user_id) {
        return error401(res, 'userNotAuthed');
    }
    getTransactionsHistoryByIdModel(user_id)
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
    const oldTxnInfo = req.body.txnInfo;
    const txnId = req.params.txn_id;
    const newAmount = req.body.changedParam.amount;
    const userId = sessionInfo.passport.user;
    if (!newAmount) {
        return error400(res, 'txnInfoMissing');
    }
    else if (!parseInt(newAmount)) {
        return error400(res, 'txnInfoIncorrect');
    }
    else {
        patchTransactionModel(oldTxnInfo, userId, txnId, newAmount)
            .then(result => {
            res.status(200).send(result);
        });
    }
});
export const deleteTransaction = ((req, res) => {
    const txnIdString = req.params.txn_id;
    const user_id = sessionInfo.passport.user;
    return deleteTransactionModel(txnIdString, user_id)
        .then(({ deletedCount }) => {
        if (deletedCount == 0) {
            error404(res, 'txnIdNotFound');
        }
        else {
            res.status(204).send();
        }
    })
        .catch((err) => {
        error400(res, 'txnIdNotValid');
    });
});
