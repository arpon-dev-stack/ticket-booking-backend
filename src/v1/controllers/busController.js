import express from 'express';
import getBus from '../services/busService/getBus.js';
import getBuses from '../services/busService/getBuses.js';
import updateBus from '../services/busService/updateBus.js';
import insertBus from '../services/busService/insertBus.js';
import deleteBus from '../services/busService/deleteBus.js';

const route = express.Router();

route.get('/', getBuses);
route.get('/:id', getBus);
route.post('/', insertBus);
route.put('/:id', updateBus);
route.delete('/:id', deleteBus);

export default route;