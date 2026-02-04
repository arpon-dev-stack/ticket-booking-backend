import { Router } from 'express';
import Bus from '../models/Bus.js';

const limit = 10;

export const createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json(bus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export const getBuses = async (req, res) => {
  // Destructure 'date' from the query
  const { from = '', to = '', date = '', pageNo = 1, limit = 10 } = req.query;

  try {
    const filter = {};
    
    if (from) filter["departure.location"] = { $regex: from, $options: 'i' };
    if (to) filter["arrival.location"] = { $regex: to, $options: 'i' };

    // --- Date Filtering Logic ---
    if (date) {
      const searchDate = new Date(date);
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

      // Filter buses where departure time falls within this specific day
      filter["departure.time"] = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    const buses = await Bus.find(filter)
      .sort({ "departure.time": 1 }) // Optional: show earliest buses first
      .skip((Number(pageNo) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Bus.countDocuments(filter);

    res.json({
      buses,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(pageNo)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export const getBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ error: 'Not found' });
    res.json(bus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!bus) return res.status(404).json({ error: 'Not found' });
    res.json(bus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};