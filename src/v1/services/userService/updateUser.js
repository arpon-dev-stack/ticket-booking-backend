import User from "../../database/user.js";

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;
        if (role) user.role = role;

        const updatedUser = await user.save();

        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json({
            message: 'User updated successfully',
            user: userResponse
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

export default updateUser;