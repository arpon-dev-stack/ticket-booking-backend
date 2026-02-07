import express from 'express';
import signInUser from '../services/userService/signInUser.js';
import signUpUser from '../services/userService/signUpUser.js';
import signOutUser from '../services/userService/signOutUser.js';
import updateUser from '../services/userService/updateUser.js';
import deleteUser from '../services/userService/deleteUser.js';

const route = express.Router();

route.post('/signin', signInUser);
route.post('/signUp', signUpUser);
route.post('/logout', signOutUser);
route.put('/:id', updateUser);
route.delete('/:id', deleteUser);

export default route;