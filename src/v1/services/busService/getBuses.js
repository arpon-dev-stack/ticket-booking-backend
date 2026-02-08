import Bus from "../../database/Bus.js";

const getBuses = async (req, res) => {
    try {
        const { departure, arrival, busType } = req.query;

        let filter = {};
        if (departure) filter['departure.location'] = { $regex: departure, $options: 'i' };
        if (arrival) filter['arrival.location'] = { $regex: arrival, $options: 'i' };
        if (busType) filter.busType = busType;

        const buses = await Bus.find(filter);
        
        const busesWithAvailability = buses.map(bus => {
            const busObj = bus.toObject();
            const availableSeats = bus.availableSeats;
            delete busObj.seatSet;
            return {
                ...busObj,
                availableSeats: availableSeats
            };
        });

        res.status(200).json({
            message: 'Buses retrieved successfully',
            count: buses.length,
            buses: busesWithAvailability
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

export default getBuses;