const PDFDocument = require("pdfkit");
const Attendance = require("../models/Attendance");
const Subject = require("../models/Subject");

exports.downloadAttendancePDF = async (req, res) => {
  try {
    const studentId = req.student._id;

    const attendance = await Attendance.aggregate([
      { $match: { student: studentId } },
      {
        $group: {
          _id: "$subject",
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0]
            }
          }
        }
      }
    ]);

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=attendance_report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20).text("Student Attendance Report", { align: "center" });
    doc.moveDown();

    for (const item of attendance) {
      const subject = await Subject.findById(item._id);
      const percentage = Math.round((item.present / item.total) * 100);

      doc
        .fontSize(14)
        .text(`Subject: ${subject?.name}`)
        .text(`Total Classes: ${item.total}`)
        .text(`Present: ${item.present}`)
        .text(`Absent: ${item.total - item.present}`)
        .text(`Attendance: ${percentage}%`)
        .moveDown();
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ message: "PDF generation failed" });
  }
};
