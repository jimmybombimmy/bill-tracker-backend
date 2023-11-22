import mongoose from 'mongoose'

import dotenv from 'dotenv';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ENV = process.env.NODE_ENV || 'test';
dotenv.config({
  path: `${__dirname}/../../.env.${ENV}` //change this
})

const conn = process.env.DB_STRING!;

export const connection = mongoose.createConnection(conn);

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  hash: String,
  salt: String,
  admin: Boolean
});

const TransactionSchema = new mongoose.Schema({
  user_id: String,
  name: String,
  type: String,
  frequency: String,
  created_at: Number
})


const User = connection.model('User', UserSchema);
const Transaction = connection.model('Transaction', TransactionSchema)