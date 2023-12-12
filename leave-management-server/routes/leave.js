// routes/leave.js
const express = require("express");
const router = express.Router();
const LeaveController = require("../controllers/LeaveController");

router.post("/apply", LeaveController.applyLeave);
router.get("/dashboard/:username", LeaveController.getDashboard);
router.get("/get-all", LeaveController.getAllLeaves);
router.get("/get-by-username", LeaveController.getUserLeaves);

module.exports = router;
