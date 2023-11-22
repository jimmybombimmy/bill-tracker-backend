// transactions.js

import { TransactionDataInterface } from "../../interfaces/data.interfaces.js";

export const transactions: TransactionDataInterface[] = [
  // User 1 transactions
  {
    user_id: "655b50b42e2bcd090b435230",
    name: "Rent Payment",
    type: "Direct Debit",
    frequency: "monthly",
    created_at: 1602828180000,
  },
  {
    user_id: "655b50b42e2bcd090b435230",
    name: "Netflix Subscription",
    type: "Standing Order",
    frequency: "monthly",
    created_at: 1615148180000,
  },
  {
    user_id: "655b50b42e2bcd090b435230",
    name: "Electricity Bill",
    type: "Direct Debit",
    frequency: "monthly",
    created_at: 1627468180000,
  },
  {
    user_id: "655b50b42e2bcd090b435230",
    name: "Gym Membership",
    type: "Recurring Payment",
    frequency: "weekly",
    created_at: 1639788180000,
  },

  // User 2 transactions
  {
    user_id: "655b5158c6965d869180e906",
    name: "Credit Card Payment",
    type: "Direct Debit",
    frequency: "monthly",
    created_at: 1609090180000,
  },
  {
    user_id: "655b5158c6965d869180e906",
    name: "Music Streaming Service",
    type: "Standing Order",
    frequency: "monthly",
    created_at: 1616770180000,
  },
  {
    user_id: "655b5158c6965d869180e906",
    name: "Water Bill",
    type: "Direct Debit",
    frequency: "quarterly",
    created_at: 1624340180000,
  },
  {
    user_id: "655b5158c6965d869180e906",
    name: "Magazine Subscription",
    type: "Recurring Payment",
    frequency: "monthly",
    created_at: 1632020180000,
  },

  // User 3 transactions
  {
    user_id: "655b51a746341227e519c2dc",
    name: "Internet Subscription",
    type: "Standing Order",
    frequency: "monthly",
    created_at: 1600912180000,
  },
  {
    user_id: "655b51a746341227e519c2dc",
    name: "Car Loan Payment",
    type: "Direct Debit",
    frequency: "monthly",
    created_at: 1613232180000,
  },
  {
    user_id: "655b51a746341227e519c2dc",
    name: "Health Insurance Premium",
    type: "Direct Debit",
    frequency: "quarterly",
    created_at: 1625552180000,
  },
  {
    user_id: "655b51a746341227e519c2dc",
    name: "Weekly Groceries",
    type: "Recurring Payment",
    frequency: "weekly",
    created_at: 1637872180000,
  },

  // User 4 transactions
  {
    user_id: "655b5292f8a18265e0b77848",
    name: "Mortgage Payment",
    type: "Direct Debit",
    frequency: "monthly",
    created_at: 1605004180000,
  },
  {
    user_id: "655b5292f8a18265e0b77848",
    name: "Mobile Phone Bill",
    type: "Direct Debit",
    frequency: "biannual",
    created_at: 1617324180000,
  },
  {
    user_id: "655b5292f8a18265e0b77848",
    name: "Video Streaming Service",
    type: "Standing Order",
    frequency: "monthly",
    created_at: 1629644180000,
  },

  // User 5 does not have any transactions
];
