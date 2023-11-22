export interface TransactionDataInterface {
  user_id: number;
  name: string;
  type: string;
  frequency: string;
  created_at: number;
}

export interface PaymentTypesDataInterface {
  type: string;
  description: string;
  examples: string;
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