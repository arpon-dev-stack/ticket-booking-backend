import express from 'express';
import { signIn, signOut, signUp, verifyMe } from '../controllers/userController.js';
import { verify } from '../middleware/verify.js';

const router = express.Router();

router.post('/signin', signIn);

router.post('/signup', signUp);

router.post('/signout', signOut);

router.post('/verify', verify, verifyMe)

export default router;