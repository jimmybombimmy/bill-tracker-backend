import { app } from '../app.js';
import { connection } from '../config/database.js'
import { users } from '../data/test-data/users.js'
import { transactions } from '../data/test-data/transactions.js';
import request from "supertest";

const User = connection.models.User
const Transaction = connection.models.Transaction

interface databaseTables {
  usersData: object[];
  transactionsData: object[];
}

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

