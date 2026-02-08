import User from "../../database/User.js";
import { validationResult } from "express-validator"

const signUpUser = async (req, res) => {

    try {

        const { password, email, name, requested = false } = req.body;

        const exist = await User.findOne({ email });

        if (exist) return res.status(400).json({ message: 'User already exist' });

        const newUser = await User.create({ name, email, password, requested });

        const userResponse = newUser.toObject();
        delete userResponse.password

        res.status(201).json({
            message: "User created successfully",
            user: userResponse
        })

    } catch (error) {

        res.status(500).json({ message: error.message || 'Enternal server error' });

    }
}

export default signUpUser;