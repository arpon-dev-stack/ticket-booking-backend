import mongoose from "mongoose";

// This defines what one individual seat looks like inside the array
const individualSeatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true }, // "A1", "A2", etc.
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

const busLayoutSchema = new mongoose.Schema({
  busId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bus', 
    required: true,
    unique: true // One layout per bus
  },
  seats: [individualSeatSchema] // The array of 40+ seats
});

const SeatLayout = mongoose.model('SeatLayout', busLayoutSchema);

export default SeatLayout;