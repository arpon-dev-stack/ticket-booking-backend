import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    paymentId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {type: Number, required: true},
    quantity: {type: Number, required: true},
    success: {type: Boolean, required: true}
});

export default mongoose.model("Payment", paymentSchema);