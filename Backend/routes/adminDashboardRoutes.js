const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const Department = require("../models/Department");

// ADMIN DASHBOARD DATA
router.get("/dashboard", verifyAdmin, async (req, res) => {
  try {
    const departments = await Department.find({
      createdBy: req.admin._id
    });

    res.json({
      admin: {
        name: req.admin.name,
        email: req.admin.email,
        department: req.admin.department
      },
      departments
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
