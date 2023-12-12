// controllers/UserController.js
const User = require("../models/User");
const Leave = require("../models/Leave");

exports.createUser = async (req, res) => {
  try {
    const { username, department } = req.body;
    const user = new User({ username, department });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    // Fetch applied leaves for each user
    const usersWithLeaves = await Promise.all(
      users.map(async (user) => {
        const appliedLeaves = await Leave.find({ username: user.username });
        return {
          _id: user._id,
          username: user.username,
          department: user.department,
          casualLeaves: user.casualLeaves,
          sickLeaves: user.sickLeaves,
          appliedLeaves,
        };
      })
    );

    res.json(usersWithLeaves);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Errors" });
  }
};
