import jwt from 'jsonwebtoken';

const verify = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided. Please log in.' });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        }
        res.status(401).json({ message: 'Invalid token. Please log in.' });
    }
};

const authorize = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!req.user.role.includes(requiredRole)) {
            return res.status(403).json({ message: `Access denied. ${requiredRole} role required.` });
        }

        next();
    };
};

export { verify, authorize };
