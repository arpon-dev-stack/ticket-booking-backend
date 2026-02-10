const signOutUser = async (req, res) => {
    try {
        res.status(200).json({
            message: 'Sign out successful'
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

export default signOutUser;