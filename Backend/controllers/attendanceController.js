const Attendance = require("../models/Attendance");
const Subject = require("../models/Subject");

/* ===============================
   STUDENT-WISE ATTENDANCE LIST
================================ */
exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.student._id;

    const attendance = await Attendance.find({ student: studentId })
      .populate("subject", "name semester");

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   SUBJECT-WISE ATTENDANCE %
================================ */
exports.getSubjectWiseAttendance = async (req, res) => {
  try {
    const studentId = req.student._id;

    const attendance = await Attendance.aggregate([
      { $match: { student: studentId } },
      {
        $group: {
          _id: "$subject",
          totalClasses: { $sum: 1 },
          presentCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0]
            }
          }
        }
      }
    ]);

    const result = await Promise.all(
      attendance.map(async (item) => {
        const subject = await Subject.findById(item._id);

        const percentage =
          item.totalClasses === 0
            ? 0
            : Math.round((item.presentCount / item.totalClasses) * 100);

        return {
          subjectId: item._id,
          subjectName: subject?.name,
          totalClasses: item.totalClasses,
          present: item.presentCount,
          absent: item.totalClasses - item.presentCount,
          percentage
        };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   OVERALL ATTENDANCE %
================================ */
exports.getAttendancePercentage = async (req, res) => {
  try {
    const studentId = req.student._id;

    const totalClasses = await Attendance.countDocuments({
      student: studentId
    });

    const present = await Attendance.countDocuments({
      student: studentId,
      status: "Present"
    });

    const percentage =
      totalClasses === 0 ? 0 : Math.round((present / totalClasses) * 100);

    res.json({
      totalClasses,
      present,
      absent: totalClasses - present,
      percentage
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
