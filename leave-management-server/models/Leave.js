// models/Leave.js
const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  username: { type: String, required: true },
  department: { type: String, required: true },
  leaveType: {
    type: String,
    enum: ["Casual Leave", "Sick Leave"],
    required: true,
  },
  from_date: { type: Date, required: true },
  to_date: { type: Date, required: true },
  number_of_days: { type: Number, required: true },
});

module.exports = mongoose.model("Leave", leaveSchema);
