import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {type: Number, required: true},
    quantity: {type: Number, required: true},
    success: {type: Boolean, required: true},
    busId: {
        type: String,
        required: true,
        ref: "Bus"
    }
});

export default mongoose.model("Payment", paymentSchema);