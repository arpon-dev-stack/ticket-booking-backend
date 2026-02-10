import mongoose from 'mongoose';

const seatSchema = mongoose.Schema({
    seatNumber: { type: String, required: true },
    booked: {
        owner: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        name: { type: String },
        bookingDate: { type: Date },
    }
});

const busSchema = mongoose.Schema({
    busNumber: { type: String, required: true },
    totalSeat: { type: Number, required: true },
    seatsPerRow: { type: Number, default: 4 },
    seatSet: [seatSchema],
    price: { type: Number, required: true },
    departure: {
        location: { type: String, required: true },
        date: { type: Date, required: true }
    },
    arrival: {
        location: { type: String, required: true },
        date: { type: Date, required: true }
    },
    amenities: {
        type: [String],
        enum: ['waterbattle', 'charger', 'wifi'],
        default: ['waterbattle']
    },
    busType: {
        type: [String],
        enum: ['ac', 'non-ac', 'sleeper'],
        default: ['non-ac']
    }
});

busSchema.virtual('availableSeats').get(function () {

    if (!this.seatSet || this.seatSet.length === 0) return this.totalSeat;

    const available = this.seatSet.filter(seat => !seat.booked.owner).length;
    return available;
});

busSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret.seatSet;
        delete ret.seatsPerRow;
        return ret;
    }
});
busSchema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret.seatSet;      // Hide the big array from the API response
        delete ret.seatsPerRow;  // Hide this too
        return ret;
    }
});
busSchema.pre('save', function () {
    if (!this.seatSet || this.seatSet.length === 0) {
        this.seatSet = [];
        const rowLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
        const seatsPerRow = this.seatsPerRow || 4;
        let seatCount = 0;

        for (let row = 0; row < Math.ceil(this.totalSeat / seatsPerRow); row++) {
            for (let col = 1; col <= seatsPerRow && seatCount < this.totalSeat; col++) {
                const seatNumber = `${rowLetters[row] || '?'}${col}`;
                this.seatSet.push({
                    seatNumber: seatNumber,
                    booked: { owner: null, name: null, date: null }
                });
                seatCount++;
            }
        }
    }
});

busSchema.index({
    'departure.location': 1,
    'arrival.location': 1,
    'departure.date': 1
})

export default mongoose.model('Bus', busSchema);