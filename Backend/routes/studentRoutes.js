const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");
const Department = require("../models/Department");
const protect = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/studentController");

/* =========================
   REGISTER STUDENT
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, rollNumber, semester, departmentId } = req.body;

    if (!name || !email || !password || !rollNumber || !semester || !departmentId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(400).json({ message: "Invalid department ID" });
    }

    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollNumber }]
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student already exists with same email or roll number"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      email,
      password: hashedPassword,
      rollNumber,
      semester,
      department: departmentId
    });

    await student.save();

    res.status(201).json({
      message: "Student registered successfully",
      studentId: student._id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   LOGIN STUDENT
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      student: {
        id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        semester: student.semester,
        department: student.department
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   STUDENT PROFILE
========================= */
router.get("/profile", protect, async (req, res) => {
  try {
    res.json({
      message: "Student profile fetched successfully",
      student: req.student
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
