import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { FiCpu, FiArrowLeft } from "react-icons/fi";

const statuses = ["Pending", "In Progress", "Resolved", "Rejected"];

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/complaints/${id}`);
        setComplaint(data);
        setStatus(data.status);
        if (data.aiAnalysis?.priority) setAiResult(data.aiAnalysis);
      } catch (err) {
        toast.error("Complaint not found");
        navigate("/complaints");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleStatusUpdate = async () => {
    try {
      const { data } = await API.put(`/complaints/${id}`, { status });
      setComplaint(data.complaint);
      toast.success("Updated status shown");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleAIAnalyze = async () => {
    setAiLoading(true);
    try {
      const { data } = await API.post("/ai/analyze", {
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        complaintId: complaint._id,
      });
      setAiResult(data.analysis);
      toast.success("AI analysis completed!");
    } catch (err) {
      toast.error("AI analysis failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!complaint) return null;

  const getStatusClass = (s) => {
    const map = { Pending: "status-pending", "In Progress": "status-progress", Resolved: "status-resolved", Rejected: "status-rejected" };
    return map[s] || "";
  };

  return (
    <div className="complaint-detail-page">
      <button className="btn-back" onClick={() => navigate("/complaints")}>
        <FiArrowLeft /> Back to List
      </button>

      <div className="detail-card">
        <div className="detail-header">
          <h1>{complaint.title}</h1>
          <span className={`status-badge ${getStatusClass(complaint.status)}`}>{complaint.status}</span>
        </div>

        <div className="detail-grid">
          <div className="detail-item"><strong>Name:</strong> {complaint.name}</div>
          <div className="detail-item"><strong>Email:</strong> {complaint.email}</div>
          <div className="detail-item"><strong>Category:</strong> {complaint.category}</div>
          <div className="detail-item"><strong>Location:</strong> {complaint.location}</div>
          <div className="detail-item"><strong>Filed On:</strong> {new Date(complaint.createdAt).toLocaleString()}</div>
          {complaint.priority && (
            <div className="detail-item"><strong>Priority:</strong> <span className={`priority-badge priority-${complaint.priority?.toLowerCase()}`}>{complaint.priority}</span></div>
          )}
        </div>

        <div className="detail-description">
          <h3>Description</h3>
          <p>{complaint.description}</p>
        </div>

        <div className="status-update-section">
          <h3>Update Status</h3>
          <div className="status-update-form">
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn-primary" onClick={handleStatusUpdate}>Update Status</button>
          </div>
        </div>

        <div className="ai-section">
          <button className="btn-secondary btn-full" onClick={handleAIAnalyze} disabled={aiLoading}>
            <FiCpu /> {aiLoading ? "Analyzing with AI..." : "Run AI Analysis"}
          </button>
        </div>
      </div>

      {aiResult && (
        <div className="ai-result-card">
          <h2>🤖 AI Analysis Result</h2>
          <div className="ai-grid">
            <div className="ai-item">
              <h4>Priority Level</h4>
              <span className={`priority-badge priority-${aiResult.priority?.toLowerCase()}`}>{aiResult.priority}</span>
            </div>
            <div className="ai-item">
              <h4>Recommended Department</h4>
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

export default ComplaintDetail;
