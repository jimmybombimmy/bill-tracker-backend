export interface TransactionDataInterface {
  user_id: string;
  name: string;
  type: string;
  frequency: string;
  created_at: number;
  amount: number;
}

export interface UserDataInterface {
  _id: string;
  username: string;
  email: string;
  hash: string;
  salt: string;
  admin: boolean;
  __v: number;
}