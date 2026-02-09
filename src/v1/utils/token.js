// helpers/auth.js
import jwt from 'jsonwebtoken';

export const genAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN,
        { expiresIn: '30m' }
    );
};