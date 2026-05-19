const { GoogleGenerativeAI } = require("@google/generative-ai");
const Complaint = require("../models/Complaint");

// Smart fallback AI analyzer using keyword-based classification
// Used when no Gemini API key is provided
const fallbackAnalyze = (title, description, category) => {
  const text = `${title} ${description} ${category}`.toLowerCase();

  // Priority detection based on keywords
  let priority = "Medium";
  const criticalKeywords = ["emergency", "danger", "fire", "flood", "collapse", "death", "explosion", "accident", "critical", "urgent"];
  const highKeywords = ["leakage", "damaged", "broken", "overflow", "sewage", "electric shock", "short circuit", "major", "severe"];
  const lowKeywords = ["suggestion", "request", "minor", "small", "cosmetic", "paint", "aesthetic"];

  if (criticalKeywords.some((kw) => text.includes(kw))) priority = "Critical";
  else if (highKeywords.some((kw) => text.includes(kw))) priority = "High";
  else if (lowKeywords.some((kw) => text.includes(kw))) priority = "Low";

  // Department recommendation based on category and keywords
  const departmentMap = {
    "water supply": "Water Supply & Sewerage Department",
    electricity: "Electrical Maintenance Department",
    "road maintenance": "Public Works Department (PWD)",
    "garbage/sanitation": "Sanitation & Waste Management Department",
    "public safety": "Public Safety & Law Enforcement Department",
    "noise pollution": "Environmental Control Department",
  };

  let department = departmentMap[category.toLowerCase()] || "General Administration Department";

  if (text.includes("water") || text.includes("pipeline") || text.includes("sewage")) {
    department = "Water Supply & Sewerage Department";
  } else if (text.includes("electric") || text.includes("power") || text.includes("transformer")) {
    department = "Electrical Maintenance Department";
  } else if (text.includes("road") || text.includes("pothole") || text.includes("bridge")) {
    department = "Public Works Department (PWD)";
  } else if (text.includes("garbage") || text.includes("waste") || text.includes("sanitation") || text.includes("cleaning")) {
    department = "Sanitation & Waste Management Department";
  }

  // Generate summary
  const summary = `Complaint regarding "${title}" in the category of ${category}. The issue involves ${description.substring(0, 100)}${description.length > 100 ? "..." : ""}. This has been classified as ${priority} priority and forwarded to the ${department}.`;

  // Generate auto-response
  const autoResponse = `Dear Citizen, thank you for reporting the issue: "${title}". Your complaint has been registered successfully and has been classified as ${priority} priority. It has been forwarded to the ${department} for immediate review and action. You will receive updates on the progress of your complaint. Reference category: ${category}. We appreciate your patience and cooperation.`;

  return { priority, department, summary, autoResponse };
};

// @desc    Analyze complaint using AI (Gemini API or fallback)
// @route   POST /api/ai/analyze
const analyzeComplaint = async (req, res) => {
  try {
    const { title, description, category, complaintId } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required." });
    }

    let analysisResult;

    // Try Gemini API if key is available
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `You are an AI assistant for a government complaint management system. Analyze the following complaint and provide a JSON response with exactly these 4 fields:

Complaint Title: ${title}
Complaint Description: ${description}
Complaint Category: ${category}

Respond with ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "priority": "Low" or "Medium" or "High" or "Critical",
  "department": "Name of the responsible government department",
  "summary": "A brief 2-3 sentence summary of the complaint",
  "autoResponse": "A professional response message to the citizen acknowledging the complaint"
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        // Parse the JSON response from Gemini
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not parse Gemini response");
        }
      } catch (aiError) {
        console.error("Gemini API Error, using fallback:", aiError.message);
        analysisResult = fallbackAnalyze(title, description, category);
      }
    } else {
      // Use the smart fallback analyzer
      analysisResult = fallbackAnalyze(title, description, category);
    }

    // If a complaintId is provided, update the complaint with AI analysis
    if (complaintId) {
      await Complaint.findByIdAndUpdate(complaintId, {
        aiAnalysis: analysisResult,
        priority: analysisResult.priority,
      });
    }

    res.json({
      message: "AI analysis completed successfully",
      analysis: analysisResult,
    });
  } catch (error) {
    console.error("AI Analyze Error:", error.message);
    res.status(500).json({ message: "Server error during AI analysis." });
  }
};

module.exports = { analyzeComplaint };
