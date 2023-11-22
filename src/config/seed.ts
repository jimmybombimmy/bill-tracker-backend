
import { connection } from '../config/database.js'
import { users } from '../data/test-data/users.js'
import { transactions } from '../data/test-data/transactions.js';

const User = connection.models.User
const Transaction = connection.models.Transaction

export default async () => {
  await User.deleteMany()
  await Transaction.deleteMany()

  await users.forEach(user => {
    User.create(user)
  })
  return transactions.forEach(transaction => {
    Transaction.create(transaction)
  })
}

