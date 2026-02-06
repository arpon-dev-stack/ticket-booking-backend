import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true, lowercase: true },
  booked: {
    owner: {
      date: { type: Date },
      bookedBy: {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: { type: String }
      }
    }
  }
});

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  busType: { type: String, enum: ['ac', 'non-ac', 'sleeper'], lowercase: true, default: 'non-ac' },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  price: { type: Number, required: true },

  departure: {
    location: { type: String, required: true, lowercase: true },
    station: { type: String },
    time: { type: Date, required: true }
  },

  arrival: {
    location: { type: String, required: true, lowercase: true },
    station: { type: String },
    time: { type: Date, required: true }
  },

  amenities: [{ type: String, lowercase: true }],

  // This allows multiple seats in one Bus
  seatSet: [seatSchema]

});

busSchema.index({ "departure.location": 1, "arrival.location": 1 });

const Bus = mongoose.model('Bus', busSchema);
export default Bus;