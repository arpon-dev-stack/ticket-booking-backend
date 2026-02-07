import jwt from 'jsonwebtoken';

export const verify = (req, res, next) => {
    console.log(req.body.token)
    try {
        const user = jwt.verify(req.body.token, process.env.ACCESS_TOKEN);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({message: "Token Failed"})
    }
}