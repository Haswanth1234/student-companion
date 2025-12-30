 const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const { getStudentDashboard } = require("../controllers/dashboardController");

// STUDENT DASHBOARD
router.get("/student", protect, getStudentDashboard);

module.exports = router;
