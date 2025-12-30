const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Subject = require("../models/Subject");

// STUDENT DASHBOARD
exports.getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.student._id;

    // student info
    const student = await Student.findById(studentId).select("-password");

    // total subjects
    const totalSubjects = await Subject.countDocuments();

    // attendance
    const totalAttendance = await Attendance.countDocuments({ student: studentId });
    const presentAttendance = await Attendance.countDocuments({
      student: studentId,
      status: "Present"
    });

    const attendancePercentage =
      totalAttendance === 0
        ? 0
        : Math.round((presentAttendance / totalAttendance) * 100);

    res.status(200).json({
      student,
      totalSubjects,
      attendancePercentage
    });

  } catch (error) {
    res.status(500).json({ message: "Dashboard server error" });
  }
};
