const express = require("express");
const { analyzeComplaint } = require("../controllers/aiController");

const router = express.Router();

// @route   POST /api/ai/analyze
router.post("/analyze", analyzeComplaint);

module.exports = router;
