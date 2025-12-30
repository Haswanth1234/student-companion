const Subject = require("../models/Subject");

// Add new subject
exports.addSubject = async (req, res) => {
  try {
    const { subjectName, department, semester } = req.body;

    if (!subjectName || !department || !semester) {
      return res.status(400).json({ message: "All fields required" });
    }

    const subject = new Subject({
      subjectName,
      department,
      semester,
    });

    await subject.save();
    res.status(201).json({ message: "Subject added successfully", subject });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all subjects
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
