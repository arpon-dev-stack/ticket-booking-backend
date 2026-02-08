// helpers/auth.js
import jwt from 'jsonwebtoken';

export const genAccessToken = (user) => {
    // Only put essential, non-sensitive data in the payload
    return jwt.sign(
        { id: user._id, role: user.email }, 
        process.env.ACCESS_TOKEN, // Use a clear env name
        { expiresIn: '30m' } // 1m is very short, 15m is standard for access tokens
    );
};