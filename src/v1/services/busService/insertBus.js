import Bus from "../../database/Bus.js";

const insertBus = async (req, res) => {
    try {
        const { busNumber, totalSeat, seatsPerRow, departure, arrival, amodities, busType, price } = req.body;

        const existingBus = await Bus.findOne({ busNumber });
        if (existingBus) {
            return res.status(409).json({ message: 'Bus with this number already exists' });
        }

        const newBus = await Bus.create({
            busNumber,
            totalSeat,
            seatsPerRow: seatsPerRow || 4,
            departure,
            arrival,
            amodities: amodities || ['waterbattle'],
            busType: busType || ['non-ac'],
            price
        });

        res.status(201).json({
            message: 'Bus created successfully',
            bus: newBus,
            availableSeats: newBus.availableSeats
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

export default insertBus;