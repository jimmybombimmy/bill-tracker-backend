import {Transaction, Cancelled_Transaction} from '../../config/database.js'

import { TransactionDataInterface } from '../../interfaces/data.interfaces.js'

export const getTransactionsByIdModel = (user_id: string) => {
  
  return Transaction.find({user_id: user_id})
    .then(txns => {
      return txns
    })
} 

export const getTransactionsHistoryByIdModel = (user_id: string) => {
  
  return Cancelled_Transaction.find({user_id: user_id})
    .then(txns => {
      return txns
    })
} 

export const postTransactionModel = (transaction: TransactionDataInterface) => {
  return Transaction.create(transaction)
    .then(result => {
      return result
    }) 
}

export const patchTransactionModel = async (oldTxnInfo: TransactionDataInterface, userId: string, txnId: string, newAmount: object) => {

  oldTxnInfo.history.unshift({amount: oldTxnInfo.amount, created_at: oldTxnInfo.created_at})

  const newHistoryInfo = oldTxnInfo.history

  const updatedInfo = {
    amount: newAmount,
    created_at: Date.now(),
    history: newHistoryInfo
  }
  
  return Transaction.updateOne({user_id: userId, _id: txnId}, updatedInfo)
  .then((result) => {
    return result
  })
}

export const deleteTransactionModel = (txnId: string) => {
  
  return Transaction.deleteOne({_id: txnId})
    .then(result => {
      console.log(result)
      return result
    })
}