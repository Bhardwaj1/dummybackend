const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

// Helper: generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Normal login
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // user can login with email, username, or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }, { phone: identifier }],
    }).select("+password");

    if (!user) return res.status(400).json({ msg: "User not found" });

    if (!user.password) {
      return res.status(400).json({ msg: "This account uses Google login" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Manual register
router.post("/register", async (req, res) => {
  const { name, email, username, phone, password } = req.body;

  try {
    const newUser = new User({ name, email, username, phone, password });
    await newUser.save();

    const token = generateToken(newUser);
    res.json({ token, user: newUser });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    // Generate JWT for Google user
    const token = generateToken(req.user);
    // Send token back to frontend (you can also redirect with query param)
    res.redirect(`http://localhost:5173/?token=${token}`);
  }
);

module.exports = router;
