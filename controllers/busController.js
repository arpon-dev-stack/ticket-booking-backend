import { Router } from 'express';
import Bus from '../models/Bus.js';


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
  const { from = '', to = '', date = '', pageNo = 1 } = req.query;

  try {
    const filter = {};
    
    if (from) filter["departure.location"] = { $regex: from, $options: 'i' };
    if (to) filter["arrival.location"] = { $regex: to, $options: 'i' };

    // --- Date Filtering Logic ---
    if (date) {
      const searchDate = new Date(date) || new Date();
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
      .skip((Number(pageNo) - 1) * 10)
      .limit(10);

    const total = await Bus.countDocuments(filter);

    res.json({
      buses,
      totalPages: Math.ceil(total / Number(10)),
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

export const bookSeat = async (req, res) => {
  try {
    const { id } = req.params;
    const { seatNumber, userId, userName } = req.body;

    console.log(id, seatNumber, userId, userName)

    const bus = await Bus.findOneAndUpdate(
      { 
        _id: id, 
        "seatSet.seatNumber": seatNumber,
        // Improved Safety: Ensure the seat doesn't have a user ID assigned yet
        "seatSet.booked.owner.bookedBy.user": null 
      },
      { 
        $set: { 
          "seatSet.$.booked.owner": {
            date: new Date(),
            bookedBy: {
              user: userId,
              name: userName
            }
          }
        },
        $inc: { availableSeats: -1 } 
      },
      { new: true, runValidators: true }
    );

    if (!bus) {
      // If this triggers, it means either:
      // 1. Bus ID is wrong
      // 2. Seat Number doesn't exist (e.g., you sent "Z99")
      // 3. The seat is ALREADY booked (user is not null)
      return res.status(400).json({ 
        error: "Cannot book this seat. It might be already taken or doesn't exist." 
      });
    }

    res.json({ message: "Seat booked successfully", bus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};