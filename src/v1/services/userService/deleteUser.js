import User from "../../database/user.js";

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete user
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User deleted successfully',
            user: {
                id: deletedUser._id,
                name: deletedUser.name,
                email: deletedUser.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

export default deleteUser;