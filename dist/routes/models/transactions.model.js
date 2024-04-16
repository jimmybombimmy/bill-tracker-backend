import { Transaction, Cancelled_Transaction } from '../../config/database.js';
export const getTransactionsByIdModel = (user_id) => {
    return Transaction.find({ user_id: user_id })
        .then(txns => {
        return txns;
    });
};
export const getSoleTransactionByIdModel = (user_id, txn_id) => {
    return Transaction.findById(txn_id)
        .then(txn => {
        if (txn === null) {
            return null;
        }
        return txn;
    });
};
export const getTransactionsHistoryByIdModel = (user_id) => {
    return Cancelled_Transaction.find({ user_id: user_id })
        .then(txns => {
        return txns;
    });
};
export const postTransactionModel = (transaction) => {
    return Transaction.create(transaction)
        .then(result => {
        return result;
    });
};
export const patchTransactionModel = async (oldTxnInfo, userId, txnId, newAmount) => {
    oldTxnInfo.history.unshift({ amount: oldTxnInfo.amount, created_at: oldTxnInfo.created_at });
    const newHistoryInfo = oldTxnInfo.history;
    const updatedInfo = {
        amount: newAmount,
        created_at: Date.now(),
        history: newHistoryInfo
    };
    return Transaction.updateOne({ user_id: userId, _id: txnId }, updatedInfo)
        .then((result) => {
        return result;
    });
};
export const deleteTransactionModel = async (txnId, user_id) => {
    // add ability to move transaction to cancelled transactions folder
    await getSoleTransactionByIdModel(user_id, txnId)
        .then((txnDetails) => {
        if (txnDetails) {
            // any type due to future tests covering for this, 
            // check back later
            const txnInfo = {
                _id: txnDetails._id,
                user_id,
                name: txnDetails.name,
                type: txnDetails.type,
                frequency: txnDetails.frequency,
                created_at: txnDetails.created_at,
                amount: txnDetails.amount,
                history: [],
                cancelled_at: Date.now()
            };
            Cancelled_Transaction.create(txnInfo);
        }
    });
    return Transaction.deleteOne({ _id: txnId })
        .then(result => {
        return result;
    });
};
