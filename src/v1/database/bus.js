import mongoose from 'mongoose';

const seatSchema = mongoose.Schema({
    seatNumber: { type: String, required: true },
    booked: {
        owner: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        name: { type: String },
        buyingDate: { type: Date },
        journeyDate: { type: Date }
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
    amodities: {
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
    const bookedSeats = this.seatSet.filter(seat => seat.booked && seat.booked.owner).length;
    return this.totalSeat - bookedSeats;
});

busSchema.set('toJSON', { virtuals: true });

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

export default mongoose.model('Bus', busSchema);