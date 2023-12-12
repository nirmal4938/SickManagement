// controllers/LeaveController.js
const Leave = require("../models/Leave");
const User = require("../models/User");

exports.applyLeave = async (req, res) => {
  try {
    const { username, leaveType, duration } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Extract start and end dates from the duration array
    const [startDate, endDate] = duration.map((dateStr) => new Date(dateStr));

    // Calculate the number of days for the leave
    const numberOfDays =
      Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;

    // Check if the user has sufficient leave balance
    if (leaveType === "Casual Leave" && user.casualLeaves < numberOfDays) {
      return res.status(500).json({ error: "Insufficient casual leaves" });
    }

    if (leaveType === "Sick Leave" && user.sickLeaves < numberOfDays) {
      return res.status(500).json({ error: "Insufficient sick leaves" });
    }

    // Save leave application details in the database
    const leave = new Leave({
      username,
      department: user.department,
      leaveType,
      from_date: startDate,
      to_date: endDate,
      number_of_days: numberOfDays,
    });

    await leave.save();

    // Deduct leaves from the user's balance
    if (leaveType === "Casual Leave") {
      user.casualLeaves -= numberOfDays;
    } else if (leaveType === "Sick Leave") {
      user.sickLeaves -= numberOfDays;
    }

    await user.save();

    res.json({ message: "Leave applied successfully" });
  } catch (error) {
    console.error("Error applying leave:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const leaves = await Leave.find({ username });

    res.json({ user, leaves });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find();

    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching leave applications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getUserLeaves = async (req, res) => {
  try {
    const { username } = req.params;

    // Fetch leave records from the database based on the username
    const userLeaves = await Leave.find({ username });

    res.json(userLeaves);
  } catch (error) {
    console.error("Error fetching user leaves:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
