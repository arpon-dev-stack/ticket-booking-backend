import Bus from "../../database/bus.js";

const deleteBus = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete bus
        const deletedBus = await Bus.findByIdAndDelete(id);
        if (!deletedBus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        res.status(200).json({
            message: 'Bus deleted successfully',
            bus: {
                id: deletedBus._id,
                busNumber: deletedBus.busNumber
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

export default deleteBus;