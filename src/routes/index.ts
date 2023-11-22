import { Router } from "express";
import passport from "passport";
import { genPassword } from "../lib/passwordUtils.js";
import {connection} from '../config/database.js'
import { isAuth } from "./authMiddleware.js";
import { getAllUsers, getUserById } from "./controllers/users.controller.js";
import { pageNotFound } from "./errors.js";



const router = Router()
const User = connection.models.User

router.get('/api/users', getAllUsers)

router.get('/api/users/:user_id', getUserById)

//this needs to be improved
router.post('/api/login', passport.authenticate('local', {failureRedirect: '/api/login-failure', successRedirect: '/api/login-success'}));

router.post('/api/register', async (req, res, next) => {
  const saltHash = genPassword(req.body.password)

  const salt = saltHash.salt
  const hash = saltHash.hash

  const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      hash: hash,
      salt: salt,
      admin: false
  })


  await newUser.save(newUser)
      .then((user: object) => {
          console.log("user details", user)
      })

  res.status(201).send({message: 'login successful'});
});

router.get('/api/login-success', (req, res, next) => {
  res.status(201).send('login successful');
});

router.get('/api/login-failure', (req, res, next) => {
  res.status(401).send('login unsuccessful.');
});

router.get('/api/:anything', pageNotFound)

export default router