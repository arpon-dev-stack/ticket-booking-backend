import express from 'express';
import { createBus, getBuses, getBus, updateBus, bookSeat } from '../controllers/busController.js';
const router = express.Router();

router.post('/', createBus);
router.get('/', getBuses);
router.get('/:id', getBus);
router.put('/:id', updateBus);
// router.delete('/:id', deleteBus);
router.put('/seat/:id', bookSeat);
router.put('/seat/:id', (req, res) => {
    res.json({message: "hello", param: req.params.id})
})

export default router;
