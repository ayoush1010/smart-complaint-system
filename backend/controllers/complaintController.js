const { validationResult } = require("express-validator");
const Complaint = require("../models/Complaint");

// @desc    Add a new complaint
// @route   POST /api/complaints
const addComplaint = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, title, description, category, location } = req.body;

    const complaint = new Complaint({
      name,
      email,
      title,
      description,
      category,
      location,
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint stored successfully",
      complaint,
    });
  } catch (error) {
    console.error("Add Complaint Error:", error.message);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation error", errors: messages });
    }
    res.status(500).json({ message: "Server error while adding complaint." });
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
const getAllComplaints = async (req, res) => {
  try {
    const { category, status } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    res.json({
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get Complaints Error:", error.message);
    res.status(500).json({ message: "Server error while fetching complaints." });
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }
    res.json(complaint);
  } catch (error) {
    console.error("Get Complaint Error:", error.message);
    res.status(500).json({ message: "Server error while fetching complaint." });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
const updateComplaint = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    res.json({
      message: "Updated status shown",
      complaint,
    });
  } catch (error) {
    console.error("Update Complaint Error:", error.message);
    res.status(500).json({ message: "Server error while updating complaint." });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    res.json({ message: "Complaint removed" });
  } catch (error) {
    console.error("Delete Complaint Error:", error.message);
    res.status(500).json({ message: "Server error while deleting complaint." });
  }
};

// @desc    Search complaints by location
// @route   GET /api/complaints/search?location=Ghaziabad
const searchByLocation = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: "Location query parameter is required." });
    }

    const complaints = await Complaint.find({
      location: { $regex: location, $options: "i" },
    }).sort({ createdAt: -1 });

    res.json({
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Search Complaint Error:", error.message);
    res.status(500).json({ message: "Server error while searching complaints." });
  }
};

module.exports = {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchByLocation,
};
