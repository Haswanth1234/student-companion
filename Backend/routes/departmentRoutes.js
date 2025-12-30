const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const Department = require("../models/Department");

// CREATE DEPARTMENT (ADMIN ONLY)
router.post("/create", verifyAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    const existingDept = await Department.findOne({ name });
    if (existingDept) {
      return res.status(400).json({
        message: "Department already exists"
      });
    }

    const dept = new Department({
      name,
      createdBy: req.admin._id
    });

    await dept.save();

    res.status(201).json({
      message: "Department created successfully",
      department: dept
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
