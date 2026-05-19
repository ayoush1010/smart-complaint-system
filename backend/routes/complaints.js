const express = require("express");
const { body } = require("express-validator");
const {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchByLocation,
} = require("../controllers/complaintController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/complaints/search?location=Ghaziabad
// NOTE: This must come BEFORE /:id to avoid "search" being treated as an ID
router.get("/search", searchByLocation);

// @route   POST /api/complaints
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("title").notEmpty().withMessage("Complaint title is required"),
    body("description").notEmpty().withMessage("Complaint description is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("location").notEmpty().withMessage("Location is required"),
  ],
  addComplaint
);

// @route   GET /api/complaints
router.get("/", getAllComplaints);

// @route   GET /api/complaints/:id
router.get("/:id", getComplaintById);

// @route   PUT /api/complaints/:id
router.put("/:id", auth, updateComplaint);

// @route   DELETE /api/complaints/:id
router.delete("/:id", auth, deleteComplaint);

module.exports = router;
