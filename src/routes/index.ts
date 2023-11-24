import { Router } from "express";
import passport from "passport";

import { isAuth } from "./authMiddleware.js";
import { getAllUsers, getUserById } from "./controllers/users.controller.js";
import { pageNotFound } from "./errors.js";
import { loginUser, registerUser } from "./controllers/auth.controller.js";
import { getTransactionsById } from "./controllers/transactions.controller.js";



const router = Router()

//User Routes
router.get('/api/users', getAllUsers)

router.get('/api/users/:user_id', getUserById)

// Auth Routes
router.post('/api/login', loginUser);

router.post('/api/register', registerUser)

router.get('/api/transactions/:user_id', getTransactionsById)

// Page not found route
router.get('/api/:anything', pageNotFound)



export default router