import User from "../../database/User.js";
import bcrypt from 'bcrypt';
import { genAccessToken } from "../../utils/token.js";

const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = genAccessToken(user);

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            message: 'Sign in successful',
            token: token,
            user: userResponse._id,
            role: userResponse.role[0],
            isAuthenticated: true
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

export default signInUser;