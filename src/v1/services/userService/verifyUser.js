
const verifyUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        res.status(200).json({
            message: 'Verify successful',
            role: req?.user?.role[0],
            isAuthenticated: true
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

export default verifyUser;