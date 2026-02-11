import express from 'express';
import signInUser from '../services/userService/signInUser.js';
import signUpUser from '../services/userService/signUpUser.js';
import signOutUser from '../services/userService/signOutUser.js';
import updateUser from '../services/userService/updateUser.js';
import deleteUser from '../services/userService/deleteUser.js';
import { signupValidation, signinValidation, updateUserValidation, deleteUserValidation } from '../middleware/validator/userValidator.js';
import { authorize, verify } from '../middleware/verify.js';
import userInfo from '../services/userService/userInfo.js';
import adminInfo from '../services/userService/adminInfo.js';
import verifyUser from '../services/userService/verifyUser.js';

const route = express.Router();

route.get('/user', verify, authorize('user'), userInfo);
route.get('/admin', verify, authorize('admin'), adminInfo);
route.post('/signin', signinValidation, signInUser);
route.post('/signUp', signupValidation, signUpUser);
route.post('/signout', signOutUser);
route.put('/:id', updateUserValidation, updateUser);
route.delete('/:id', deleteUserValidation, deleteUser);
route.post('/verify', verify, verifyUser);

export default route;