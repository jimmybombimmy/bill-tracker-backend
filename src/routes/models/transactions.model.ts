import {Transaction} from '../../config/database.js'
import { TransactionDataInterface } from '../../interfaces/data.interfaces.js'

export const getTransactionsByIdModel = (user_id: string) => {
  
  return Transaction.find({user_id: user_id})
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