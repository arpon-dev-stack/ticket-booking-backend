import express from 'express';
import makePayment from '../services/paymentService/makePayment.js';
import { makePaymentValidation } from '../middleware/validator/paymentValidator.js';
import { verify } from '../middleware/verify.js';

const route = express.Router();

route.post('/', verify, makePaymentValidation, makePayment);

export default route;