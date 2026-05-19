const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  title: {
    type: String,
    required: [true, "Complaint title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Complaint description is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: [
      "Water Supply",
      "Electricity",
      "Road Maintenance",
      "Garbage/Sanitation",
      "Public Safety",
      "Noise Pollution",
      "Other",
    ],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved", "Rejected"],
    default: "Pending",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "Medium",
  },
  aiAnalysis: {
    priority: String,
    department: String,
    summary: String,
    autoResponse: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
