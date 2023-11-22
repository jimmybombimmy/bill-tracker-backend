import MongoStore from "connect-mongo";
import session from 'express-session'

import dotenv from 'dotenv';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ENV = process.env.NODE_ENV || 'test';
dotenv.config({
  path: `${__dirname}/../../.env.${ENV}` //change this
})
const sessionStore = MongoStore.create({ mongoUrl: process.env.DB_STRING, collectionName: 'sessions' })


export default session({
  secret: process.env.SECRET!,
  resave: false,
  saveUninitialized: true,
  store: sessionStore, 
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 
  } 
})