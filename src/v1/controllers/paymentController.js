import express from 'express';
import makePayment from '../services/paymentService/makePayment.js';
import { makePaymentValidation } from '../middleware/validator/paymentValidator.js';

const route = express.Router();

route.post('/', makePaymentValidation, makePayment);

export default route;