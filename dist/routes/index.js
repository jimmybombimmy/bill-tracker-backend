import { Router } from "express";
import { isAuth } from "./authMiddleware.js";
import { getAllUsers, getUserById } from "./controllers/users.controller.js";
import { pageNotFound } from "./errors.js";
import { loginSuccess, loginUser, logoutUser, registerUser } from "./controllers/auth.controller.js";
import { getTransactionsById, getTransactionsHistoryById, patchTransaction, postTransaction } from "./controllers/transactions.controller.js";
const router = Router();
// User Routes
router.get('/api/users', getAllUsers);
router.get('/api/users/:user_id', getUserById);
// Auth Routes
router.post('/api/register', registerUser);
router.post('/api/login', loginUser);
router.get('/api/login-success', loginSuccess);
router.post('/api/logout', logoutUser);
// Transaction Routes
router.get('/api/transactions/:user_id', isAuth, getTransactionsById);
router.get('/api/transactions/history/:user_id', isAuth, getTransactionsHistoryById);
router.post('/api/transactions', isAuth, postTransaction);
router.patch('/api/transactions/:txn_id', isAuth, patchTransaction);
// Page not found route
router.get('/api/:anything', pageNotFound);
export default router;
