import { Router } from "express";
import passport from "passport";

import { isAuth } from "./authMiddleware.js";
import { getAllUsers, getUserById } from "./controllers/users.controller.js";
import { pageNotFound } from "./errors.js";
import { forgotPassword, loginSuccess, loginUser, logoutUser, passwordReset, registerUser } from "./controllers/auth.controller.js";
import { getTransactionsById, getSoleTransactionById, getTransactionsHistoryById, patchTransaction, postTransaction, deleteTransaction } from "./controllers/transactions.controller.js";



const router = Router()



// User Routes
router.get('/api/users', getAllUsers)

router.get('/api/users/:user_id', getUserById)

// Auth Routes
router.post('/api/register', registerUser)

router.post('/api/login', loginUser);

router.get('/api/login-success', loginSuccess);

router.post('/api/logout', logoutUser);

router.post('/api/forgot-password', forgotPassword);

router.patch('/api/reset-password/:token', passwordReset)

// Transaction Routes
router.get('/api/transactions/:user_id', isAuth, getTransactionsById)

router.get('/api/transactions/history/:user_id', isAuth, getTransactionsHistoryById)

router.get('/api/transactions/:user_id/:txn_id', isAuth, getSoleTransactionById)

router.post('/api/transactions', isAuth, postTransaction)

router.patch('/api/transactions/:txn_id', isAuth, patchTransaction)

router.delete('/api/transactions/:txn_id', isAuth, deleteTransaction)

// Page not found route
router.get('/api/:anything', pageNotFound)



export default router