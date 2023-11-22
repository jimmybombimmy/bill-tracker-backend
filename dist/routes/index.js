import { Router } from "express";
import passport from "passport";
import { getAllUsers, getUserById } from "./controllers/users.controller.js";
import { pageNotFound } from "./errors.js";
import { registerUserById } from "./controllers/auth.controller.js";
const router = Router();
router.get('/api/users', getAllUsers);
router.get('/api/users/:user_id', getUserById);
//this needs to be improved
router.post('/api/login', passport.authenticate('local', { failureRedirect: '/api/login-failure', successRedirect: '/api/login-success' }));
router.post('/api/register', registerUserById);
router.get('/api/login-success', (req, res, next) => {
    res.status(201).send('login successful');
});
router.get('/api/login-failure', (req, res, next) => {
    res.status(401).send('login unsuccessful.');
});
router.get('/api/:anything', pageNotFound);
export default router;
