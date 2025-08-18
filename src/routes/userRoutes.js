const express = require("express");
const User = require("../models/User");

const router = express.Router();

// @desc get all user;

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {

    console.log("POST /api/users hit"); // <
  try {
    const { name, email, username,phone,password} = req.body;
    const user = new User({
      name,
      email,
      username,
      phone,
      password
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete('/:id',async(req,res)=>{
    try {
        const { id } = req.params;
        const deletedUser=await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({error:"User not found"});
        }

        res.json({message:"User deleted successfully"});
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
