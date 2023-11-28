import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ENV = process.env.NODE_ENV || 'test';
dotenv.config({
    path: `${__dirname}/../../.env.${ENV}` //change this
});
const conn = process.env.DB_STRING;
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
    frequency: { period: String, custom_days: Number },
    created_at: Number,
    amount: Number,
    history: Array
});
const CancelledTransactionSchema = new mongoose.Schema({
    user_id: String,
    name: String,
    type: String,
    frequency: { period: String, custom_days: Number },
    created_at: Number,
    amount: Number,
    history: Array,
    cancelled: Number
});
export const User = connection.model('User', UserSchema);
export const Transaction = connection.model('Transaction', TransactionSchema);
export const Cancelled_Transaction = connection.model('Cancelled_Transaction', CancelledTransactionSchema);
