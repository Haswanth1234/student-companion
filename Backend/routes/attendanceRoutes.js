const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");
const verifyAdmin = require("../middleware/verifyAdmin");
const protect = require("../middleware/protect");

const {
  getStudentAttendance,
  getSubjectWiseAttendance,
  getAttendancePercentage
} = require("../controllers/attendanceController");

const { downloadAttendancePDF } = require("../controllers/attendancePdfController");

/* ===============================
   STUDENT ROUTES
================================ */

// Student – full attendance list
router.get("/student", protect, getStudentAttendance);

// Student – subject wise percentage
router.get("/subject-wise", protect, getSubjectWiseAttendance);

// Student – overall percentage
router.get("/percentage", protect, getAttendancePercentage);

router.get("/download-pdf", protect, downloadAttendancePDF);

/* ===============================
   ADMIN ROUTES
================================ */

// Mark attendance
router.post("/mark", verifyAdmin, async (req, res) => {
  try {
    const { studentId, subjectId, status } = req.body;

    if (!studentId || !subjectId || !status) {
      return res.status(400).json({ message: "All fields required" });
    }

    const attendance = new Attendance({
      student: studentId,
      subject: subjectId,
      status
    });

    await attendance.save();

    res.status(201).json({ message: "Attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
