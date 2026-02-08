import express from 'express';
import getBus from '../services/busService/getBus.js';
import getBuses from '../services/busService/getBuses.js';
import updateBus from '../services/busService/updateBus.js';
import insertBus from '../services/busService/insertBus.js';
import deleteBus from '../services/busService/deleteBus.js';
import { getBusesValidation, getBusValidation, createBusValidation, updateBusValidation, deleteBusValidation } from '../middleware/validator/busValidator.js';
import { verify, authorize } from '../middleware/verify.js';

const route = express.Router();

route.get('/', verify, getBusesValidation, getBuses);

route.get('/:id', verify, getBusValidation, getBus);

route.post('/', verify, authorize('admin'), createBusValidation, insertBus);

route.put('/:id', verify, updateBusValidation, updateBus);

route.delete('/:id', verify, authorize('admin'), deleteBusValidation, deleteBus);

export default route;