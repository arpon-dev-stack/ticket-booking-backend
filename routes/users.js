import express from 'express';
import { logOut, signIn, signUp } from '../controllers/userController.js';

const router = express.Router();

router.post('/signin', signIn);

router.post('/signup', signUp);

router.post('/logout', logOut)

export default router;