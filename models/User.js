import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { type: String, required: true }, // Should be hashed!

    // Array of bookings to show the user their history
    bookings: [{
        busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
        seatNumbers: [String], // e.g., ["D1", "D2"]
        totalPrice: Number,
        bookingDate: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ['confirmed', 'cancelled', 'pending'],
            default: 'confirmed'
        }
    }],

    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    const compaired = await bcrypt.compare(candidatePassword, this.password)
    return compaired;
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next()
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model('User', userSchema);

export default User;