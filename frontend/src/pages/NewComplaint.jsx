import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { FiSend, FiCpu } from "react-icons/fi";

const categories = [
  "Water Supply",
  "Electricity",
  "Road Maintenance",
  "Garbage/Sanitation",
  "Public Safety",
  "Noise Pollution",
  "Other",
];

const NewComplaint = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    category: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAIAnalyze = async () => {
    if (!form.title || !form.description || !form.category) {
      toast.warn("Please fill in Title, Description, and Category first");
      return;
    }
    setAiLoading(true);
    try {
      const { data } = await API.post("/ai/analyze", {
        title: form.title,
        description: form.description,
        category: form.category,
      });
      setAiResult(data.analysis);
      toast.success("AI analysis completed!");
    } catch (err) {
      toast.error("AI analysis failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/complaints", form);

      // If AI analysis was done, update the complaint with it
      if (aiResult && data.complaint._id) {
        await API.post("/ai/analyze", {
          title: form.title,
          description: form.description,
          category: form.category,
          complaintId: data.complaint._id,
        });
      }

      toast.success("Complaint stored successfully!");
      navigate("/complaints");
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Failed to submit complaint";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-complaint-page">
      <div className="form-container">
        <div className="form-header">
          <h1>📋 Register New Complaint</h1>
          <p>Fill in the details below to submit your complaint</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="comp-name">Full Name</label>
              <input id="comp-name" type="text" name="name" placeholder="Rahul Kumar" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="comp-email">Email</label>
              <input id="comp-email" type="email" name="email" placeholder="rahul@gmail.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="comp-title">Complaint Title</label>
              <input id="comp-title" type="text" name="title" placeholder="Water Leakage Issue" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="comp-category">Category</label>
              <select id="comp-category" name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="comp-location">Location</label>
              <input id="comp-location" type="text" name="location" placeholder="Ghaziabad" value={form.location} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="comp-desc">Complaint Description</label>
            <textarea id="comp-desc" name="description" placeholder="Describe the issue in detail..." rows={4} value={form.description} onChange={handleChange} required />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleAIAnalyze} disabled={aiLoading}>
              <FiCpu /> {aiLoading ? "Analyzing..." : "AI Analyze"}
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <FiSend /> {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>

      {aiResult && (
        <div className="ai-result-card">
          <h2>🤖 AI Analysis Result</h2>
          <div className="ai-grid">
            <div className="ai-item">
              <h4>Priority</h4>
              <span className={`priority-badge priority-${aiResult.priority?.toLowerCase()}`}>{aiResult.priority}</span>
            </div>
            <div className="ai-item">
              <h4>Suggested Department</h4>
              <p>{aiResult.department}</p>
            </div>
            <div className="ai-item ai-full">
              <h4>Complaint Summary</h4>
              <p>{aiResult.summary}</p>
            </div>
            <div className="ai-item ai-full">
              <h4>Auto-Generated Response</h4>
              <p className="ai-response">{aiResult.autoResponse}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewComplaint;
