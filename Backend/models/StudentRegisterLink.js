const mongoose = require("mongoose");

const studentRegisterLinkSchema = new mongoose.Schema({
  department: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

module.exports = mongoose.model(
  "StudentRegisterLink",
  studentRegisterLinkSchema
);