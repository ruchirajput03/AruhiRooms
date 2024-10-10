const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const generateToken = require("../utils/jwttokens");

// Register a new user
router.post("/register", asyncHandler(async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new user
    const newUser = new User({ name, email, password, isAdmin });

    try {
        const user = await newUser.save();
        res.status(201).json({ message: 'User Registered Successfully', name: user.name, email: user.email, token: generateToken(user._id) });
    } catch (error) {
        return res.status(400).json({ error });
    }
}));

// Login a user
router.post("/login", asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const temp = {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                _id: user._id,
                token: generateToken(user._id),
            };
            res.json(temp);
        } else {
            return res.status(400).json({ message: 'Login failed' });
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
}));

// Fetch all users
router.get("/all", asyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        return res.status(400).json({ error });
    }
}));

module.exports = router;
