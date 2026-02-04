import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({

})

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  busType: { type: String, enum: ['AC', 'Non-AC', 'Sleeper'], default: 'Non-AC' },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  price: { type: Number, required: true },
  
  departure: {
    location: { type: String, required: true }, // e.g., "Dhaka"
    station: { type: String },                 // e.g., "Gabtoli"
    time: { type: Date, required: true }       // Full ISO Date
  },
  
  arrival: {
    location: { type: String, required: true }, // e.g., "Sylhet"
    station: { type: String },
    time: { type: Date, required: true }
  },
  
  amenities: [String] // e.g., ["WiFi", "Water", "Blanket"],

  
});


// Adding indexes improves search speed for "from" and "to"
busSchema.index({ "departure.location": "text", "arrival.location": "text" });

const Bus = mongoose.model('Bus', busSchema);

export default Bus;