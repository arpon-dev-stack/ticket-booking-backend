import Bus from "../../database/Bus.js";

const updateBus = async (req, res) => {
    try {
        const { id } = req.params;
        const { busNumber, totalSeat, seatsPerRow, departure, arrival, amenities, busType } = req.body;

        // Find bus
        const bus = await Bus.findById(id);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        // Track if seat config changed
        const seatConfigChanged = (totalSeat && totalSeat !== bus.totalSeat) || (seatsPerRow && seatsPerRow !== bus.seatsPerRow);

        // Update fields if provided
        if (busNumber) bus.busNumber = busNumber;
        if (totalSeat) bus.totalSeat = totalSeat;
        if (seatsPerRow) bus.seatsPerRow = seatsPerRow;
        if (departure) bus.departure = { ...bus.departure, ...departure };
        if (arrival) bus.arrival = { ...bus.arrival, ...arrival };
        if (amenities) bus.amenities = amenities;
        if (busType) bus.busType = busType;

        // Regenerate seats if config changed
        if (seatConfigChanged) {
            bus.seatSet = [];
        }

        // Save updated bus
        const updatedBus = await bus.save();

        res.status(200).json({
            message: 'Bus updated successfully',
            bus: updatedBus
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

export default updateBus;