import Payment from "../../database/Payment.js";
import Bus from "../../database/Bus.js";

const makePayment = async (req, res) => {

    try {

        const { paymentId, busId, seat, name, journeyDate, buyingDate = new Date() } = req.body;

        const bus = await Bus.findById(busId);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        const requestedSeatObjects = bus.seatSet.filter(s =>
            seat.includes(s.seatNumber)
        );
        if (requestedSeatObjects.length !== seat.length) {
            return res.status(404).json({ message: 'One or more seat numbers are invalid for this bus' });
        }
        const alreadyBooked = requestedSeatObjects.filter(s => s.booked && s.booked.owner);
        if (alreadyBooked.length > 0) {
            return res.status(404).json({ message: 'One or more seat numbers are already booked' });
        }

        const payment = await Payment.create({
            paymentId,
            success: true,
            amount: requestedSeatObjects.length * bus.price,
            quantity: requestedSeatObjects.length
        });

        requestedSeatObjects.forEach(s => {
            s.booked.owner = paymentId;
            s.booked.journeyDate = journeyDate;
            s.booked.name = name;
            s.booked.buyingDate = buyingDate;
        });

        await bus.save();

        res.status(201).json({
            message: 'Payment successful',
            payment: payment,
            seat: seat,
            amount: requestedSeatObjects.length * bus.price
        });

    } catch (error) {

        res.status(500).json({ message: error.message || 'Internal server error' });

    }
}

export default makePayment;

// import Payment from "../../database/Payment.js";
// import Bus from "../../database/Bus.js";

// const makePayment = async (req, res) => {
//     try {
//         const { paymentId, busId, seat, name, buyingDate = new Date(), journeyDate } = req.body;

//         const updatedBus = await Bus.findOneAndUpdate(
//             {
//                 _id: busId,
//                 "seatSet": {
//                     $all: seat.map(sNum => ({
//                         $elemMatch: { seatNumber: sNum, "booked.owner": null }
//                     }))
//                 }
//             },
//             {
//                 $set: {
//                     "seatSet.$[elem].booked.owner": paymentId,
//                     "seatSet.$[elem].booked.name": name,
//                     "seatSet.$[elem].booked.buyingDate": buyingDate,
//                     "seatSet.$[elem].booked.journeyDate": journeyDate 
//                 }
//             },
//             {
//                 arrayFilters: [{ "elem.seatNumber": { $in: seat } }],
//                 new: true
//             }
//         );

//         if (!updatedBus) {
//             return res.status(409).json({
//                 message: 'Seats are unavailable, already booked, or invalid.'
//             });
//         }

//         const totalAmount = seat.length * updatedBus.price;
//         const payment = await Payment.create({
//             paymentId,
//             success: true,
//             amount: totalAmount,
//             quantity: seat.length
//         });

//         res.status(201).json({
//             message: 'Payment and booking successful',
//             payment,
//             seat,
//             amount: totalAmount
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message || 'Internal server error' });
//     }
// };

// export default makePayment;