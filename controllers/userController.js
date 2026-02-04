import User from '../models/User.js';
import { genAccessToken } from '../utils/token.js';

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = genAccessToken(user);

        // Optional: Set the token in a header as well
        res.setHeader('Authorization', `Bearer ${token}`);

        res.status(200).json({ 
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token // Redux will look for this key
        });

    } catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const signUp = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const user = await User.findOne({ email });

        // 1. CRITICAL FIX: Add 'return' so code stops here if user exists
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Await the creation: Ensure DB finished saving before responding
        const newUser = await User.create({ email, password, name });

        // 3. Success response
        res.status(201).json({ 
            message: "User created successfully",
            user: { id: newUser._id, name: newUser.name, email: newUser.email } 
        });
        
    } catch (error) {
        // Log the actual error for debugging
        console.error(error); 
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logOut = async (req, res) => {
    res.json({message: "logout"})
}