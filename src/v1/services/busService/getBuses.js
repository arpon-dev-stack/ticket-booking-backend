import Bus from "../../database/Bus.js";

const getBuses = async (req, res) => {
    try {
        const { from, to, date = new Date(), page = 1 } = req.query;

        let filter = {};
        if (from) filter['departure.location'] = { $regex: from, $options: 'i' };
        if (to) filter['arrival.location'] = { $regex: to, $options: 'i' };
        if (date) filter['departure.date'] = { $gte: new Date(date) };

        const totalBus = await Bus.countDocuments(filter);

        const buses = await Bus.find(filter).limit(15).skip((page - 1) * 15);

        const busesWithAvailability = buses.map(bus => {
            const busObj = bus.toObject();
            const availableSeats = bus.availableSeats;
            delete busObj.seatSet;
            return {
                ...busObj,
                availableSeats: availableSeats,
            };
        });

        res.status(200).json({
            message: 'Buses retrieved successfully',
            buses: busesWithAvailability,
            totalBus
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

export default getBuses;