import { app } from '../app.js';
import { connection } from '../config/database.js'
import { users } from '../data/test-data/users.js'
import request from "supertest";

const User = connection.models.User

interface databaseTables {
  usersData: object[];
  transactionsData: object[];
}

export default async () => {
  await User.deleteMany()

  return users.forEach(user => {
    User.create(user)
  })
}

