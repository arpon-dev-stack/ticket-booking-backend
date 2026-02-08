import express from 'express';
import signInUser from '../services/userService/signInUser.js';
import signUpUser from '../services/userService/signUpUser.js';
import signOutUser from '../services/userService/signOutUser.js';
import updateUser from '../services/userService/updateUser.js';
import deleteUser from '../services/userService/deleteUser.js';
import { signupValidation, signinValidation, updateUserValidation, deleteUserValidation } from '../middleware/validator/userValidator.js';

const route = express.Router();

route.post('/signin', signinValidation, signInUser);
route.post('/signUp', signupValidation, signUpUser);
route.post('/logout', signOutUser);
route.put('/:id', updateUserValidation, updateUser);
route.delete('/:id', deleteUserValidation, deleteUser);

export default route;