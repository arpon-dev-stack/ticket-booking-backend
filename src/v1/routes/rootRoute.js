import express from 'express';
import busController from '../controllers/busController.js'
import userController from '../controllers/userController.js'
import paymentController from '../controllers/paymentController.js'


const route = express.Router();

route.use('/v1/user', userController);
route.use('/v1/bus', busController);
route.use('/v1/payment', paymentController);

export default route;