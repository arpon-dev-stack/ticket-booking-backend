import express from 'express';
import makePayment from '../services/paymentService/makePayment.js';

const route = express.Router();

route.post('/', makePayment);

export default route;