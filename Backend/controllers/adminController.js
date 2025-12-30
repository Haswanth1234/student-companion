const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

// ADMIN REGISTER
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, department, password } = req.body;

    // 1. Check all fields
    if (!name || !email || !department || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // 3. Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save admin
    const newAdmin = new Admin({
      name,
      email,
      department,
      password: hashedPassword
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin registered successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 3. Success
    res.status(200).json({
      message: "Admin login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        department: admin.department
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
