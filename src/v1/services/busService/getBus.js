import Bus from "../../database/Bus.js";

const getBus = async (req, res) => {
    try {
        const { id } = req.params;

        // Find bus by ID
        const bus = await Bus.findById(id);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        res.status(200).json({
            message: 'Bus retrieved successfully',
            bus: bus,
            availableSeats: bus.availableSeats
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

export default getBus;