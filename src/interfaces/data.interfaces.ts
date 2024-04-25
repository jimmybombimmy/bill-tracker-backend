export interface TransactionDataInterface {
  user_id: string;
  name: string;
  type: string;
  frequency: { period: string; custom_days: Number; }
  created_at: number;
  amount: number;
  history: object[];
}

export interface UserDataInterface {
  _id: string;
  username: string;
  email: string;
  hash: string;
  salt: string;
  admin: boolean;
  passwordReset: {passwordResetToken: string, passwordResetTokenExpires: Number|string}
  __v: number;
}

export interface CancelledTransactionDataInterface {
  user_id: string;
  name: string;
  type: string;
  frequency: { period: string; custom_days: Number; }
  created_at: number;
  amount: number;
  history: object[];
  cancelled_at: number;
}