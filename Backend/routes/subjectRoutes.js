const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const verifyAdmin = require("../middleware/verifyAdmin");

// CREATE SUBJECT (Admin only)
router.post("/create", verifyAdmin, async (req, res) => {
  try {
    const { name, semester, departmentId } = req.body;

    const subject = new Subject({
      name,
      semester,
      department: departmentId,
      createdBy: req.admin._id
    });

    await subject.save();

    res.json({ message: "Subject created successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL SUBJECTS (Admin / Student)
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("department", "name");

    res.json(subjects);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
