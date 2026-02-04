import express from 'express';
import { createBus, getBuses, getBus, updateBus, deleteBus } from '../controllers/busController.js';
const router = express.Router();

router.post('/', createBus);
router.get('/', getBuses);
router.get('/:id', getBus);
router.put('/:id', updateBus);
router.delete('/:id', deleteBus);

export default router;
